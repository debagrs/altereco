/* ══════════════════════════════════════════════════════
   ALTERECO — ADMINISTRAÇÃO E CURADORIA
   Supabase Auth + content_items + RLS
══════════════════════════════════════════════════════ */

const ALTERECO_CONTENT_AREAS = new Set([
    'metodos',
    'materiais',
    'publicacoes',
    'legislacao',
    'bases-dados',
    'eventos'
]);

const alterecoContentCache = {
    approved: [],
    loaded: false
};

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizeExternalUrl(value) {
    const raw = String(value || '').trim();
    if (!raw || raw === '#') return null;

    try {
        const parsed = new URL(raw);
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;
        return parsed.href;
    } catch (_) {
        return null;
    }
}

function normalizeContentArea(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'bases') return 'bases-dados';
    return ALTERECO_CONTENT_AREAS.has(normalized)
        ? normalized
        : 'publicacoes';
}

function normalizeTags(value) {
    if (Array.isArray(value)) {
        return [...new Set(
            value
                .map(tag => String(tag).trim())
                .filter(Boolean)
                .slice(0, 20)
        )];
    }

    return [...new Set(
        String(value || '')
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .slice(0, 20)
    )];
}

function formatContentDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function mapContentItemToLegacyPost(item) {
    return {
        id: item.id,
        title: item.title,
        author: item.author_name,
        area: item.area,
        tags: Array.isArray(item.tags) ? item.tags : [],
        description: item.description,
        long_description: item.long_description || '',
        url: item.external_url || '#',
        image: item.image_url || '',
        date: formatContentDate(
            item.published_at || item.reviewed_at || item.submitted_at
        ),
        status: item.status,
        submitted_by: item.submitted_by,
        submitted_at: item.submitted_at,
        reviewed_at: item.reviewed_at,
        rejection_reason: item.rejection_reason || ''
    };
}

async function fetchContentItemsByStatus(status) {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('content_items')
        .select(`
            id,
            title,
            author_name,
            area,
            tags,
            description,
            long_description,
            external_url,
            image_url,
            status,
            submitted_by,
            reviewed_by,
            submitted_at,
            reviewed_at,
            published_at,
            rejection_reason,
            created_at,
            updated_at
        `)
        .eq('status', status)
        .order('submitted_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapContentItemToLegacyPost);
}

async function refreshApprovedContentCache() {
    try {
        alterecoContentCache.approved =
            await fetchContentItemsByStatus('approved');
        alterecoContentCache.loaded = true;

        window.dispatchEvent(new CustomEvent(
            'altereco:content-updated',
            { detail: { status: 'approved' } }
        ));
    } catch (error) {
        console.error('Erro ao carregar conteúdos públicos:', error);
    }
}

window.getDynamicPostsForArea = function(areaId) {
    const area = normalizeContentArea(areaId);

    if (!alterecoContentCache.loaded) {
        refreshApprovedContentCache();
    }

    return alterecoContentCache.approved.filter(
        post => post.area === area
    );
};

/* ════════════ AUTHENTICATION — SUPABASE ════════════ */

const ALTERECO_ROLE_MAP = {
    admin: 'admin',
    curador: 'curator',
    curator: 'curator'
};

function getSupabaseClient() {
    if (!window.alterecoSupabase) {
        throw new Error('A conexão com o Supabase não foi carregada.');
    }
    return window.alterecoSupabase;
}

function saveVerifiedSession(user, profile) {
    const sessionData = {
        id: user.id,
        email: user.email,
        name: profile.full_name || user.email,
        role: profile.role
    };

    sessionStorage.setItem(
        'altereco_session',
        JSON.stringify(sessionData)
    );

    return sessionData;
}

function clearAlterEcoSession() {
    sessionStorage.removeItem('altereco_session');
}

async function getVerifiedAccess(expectedRole = null) {
    const supabaseClient = getSupabaseClient();

    const {
        data: { session },
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session || !session.user) {
        clearAlterEcoSession();
        return null;
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id, full_name, role, active')
        .eq('id', session.user.id)
        .single();

    if (profileError) throw profileError;

    if (!profile || profile.active !== true) {
        await supabaseClient.auth.signOut();
        clearAlterEcoSession();
        throw new Error(
            'Sua conta existe, mas ainda não foi ativada pela administração.'
        );
    }

    const normalizedExpectedRole = expectedRole
        ? ALTERECO_ROLE_MAP[expectedRole]
        : null;

    if (
        normalizedExpectedRole === 'admin' &&
        profile.role !== 'admin'
    ) {
        throw new Error(
            'Esta conta não possui permissão de administradora.'
        );
    }

    if (
        normalizedExpectedRole === 'curator' &&
        !['admin', 'curator'].includes(profile.role)
    ) {
        throw new Error(
            'Esta conta não possui permissão para a curadoria.'
        );
    }

    return saveVerifiedSession(session.user, profile);
}

window.processLogin = async function(event, role) {
    event.preventDefault();

    const emailInput = document.getElementById('log-email');
    const passwordInput = document.getElementById('log-pass');
    const submitButton = event.submitter;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const normalizedRole = ALTERECO_ROLE_MAP[role];

    if (!normalizedRole) {
        alert('Tipo de acesso inválido.');
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Verificando acesso...';
    }

    try {
        const supabaseClient = getSupabaseClient();

        const { error: loginError } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (loginError) throw loginError;

        const verifiedSession =
            await getVerifiedAccess(normalizedRole);

        if (!verifiedSession) {
            throw new Error(
                'Não foi possível confirmar a sessão.'
            );
        }

        if (normalizedRole === 'admin') {
            await renderAdminDashboard();
        } else {
            await renderCuradorDashboard();
        }
    } catch (error) {
        console.error('Erro no login AlterECO:', error);

        try {
            await window.alterecoSupabase?.auth.signOut();
        } catch (_) {
            // Não interrompe a mensagem principal.
        }

        clearAlterEcoSession();

        const friendlyMessage =
            error.message === 'Invalid login credentials'
                ? 'E-mail ou senha incorretos.'
                : error.message;

        alert(
            `Não foi possível entrar.\n\n${friendlyMessage}`
        );
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar no Sistema';
        }
    }
};

window.logout = async function() {
    try {
        if (window.alterecoSupabase) {
            await window.alterecoSupabase.auth.signOut();
        }
    } catch (error) {
        console.error('Erro ao encerrar sessão:', error);
    } finally {
        clearAlterEcoSession();
        renderPage('home');
    }
};

function renderLogin(role) {
    const c = document.getElementById('content-area');
    const title =
        role === 'admin'
            ? 'Acesso Administrativo'
            : 'Painel da Curadoria';

    c.innerHTML = `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; background:var(--bg-light); padding:2rem;">
        <div style="background:var(--white); padding:clamp(2rem, 6vw, 4rem); border-radius:var(--border-radius); box-shadow:var(--shadow); max-width:450px; width:100%;">
            <div style="text-align:center; margin-bottom:2rem;">
                <i
                    data-lucide="${role === 'admin' ? 'shield-check' : 'user-check'}"
                    style="width:64px; height:64px; color:var(--primary-navy);"
                    aria-hidden="true"
                ></i>

                <h2 style="color:var(--primary-navy); margin-top:1rem;">
                    ${title}
                </h2>

                <p style="color:var(--text-gray); font-size:0.9rem;">
                    Área protegida por autenticação individual
                </p>
            </div>

            <form
                onsubmit="processLogin(event, '${role}')"
                style="display:flex; flex-direction:column; gap:1.5rem;"
            >
                <div>
                    <label
                        for="log-email"
                        style="font-weight:bold; display:block; margin-bottom:0.5rem;"
                    >
                        E-mail cadastrado
                    </label>

                    <input
                        type="email"
                        id="log-email"
                        autocomplete="email"
                        required
                        placeholder="seuemail@instituicao.br"
                        style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;"
                    >
                </div>

                <div>
                    <label
                        for="log-pass"
                        style="font-weight:bold; display:block; margin-bottom:0.5rem;"
                    >
                        Senha
                    </label>

                    <input
                        type="password"
                        id="log-pass"
                        autocomplete="current-password"
                        required
                        placeholder="Sua senha"
                        style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;"
                    >
                </div>

                <button
                    type="submit"
                    style="width:100%; padding:1rem; border:none; cursor:pointer; font-weight:bold; font-size:1.1rem; background:var(--primary-navy); color:white; border-radius:8px; transition:0.3s;"
                >
                    Entrar no Sistema
                </button>
            </form>

            <div style="display:flex; justify-content:center; margin-top:1.5rem; font-size:0.9rem; font-weight:500;">
                <a
                    href="#"
                    onclick="event.preventDefault(); renderResetPassword('${role}');"
                    style="color:var(--text-gray); text-decoration:underline;"
                >
                    Esqueci minha senha
                </a>
            </div>
        </div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
}

window.renderResetPassword = function(role) {
    const c = document.getElementById('content-area');

    c.innerHTML = `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; background:var(--bg-light); padding:2rem;">
        <div style="background:var(--white); padding:clamp(2rem, 6vw, 4rem); border-radius:var(--border-radius); box-shadow:var(--shadow); max-width:450px; width:100%;">
            <div style="text-align:center; margin-bottom:2rem;">
                <i
                    data-lucide="mail-check"
                    style="width:64px; height:64px; color:var(--mint-teal);"
                    aria-hidden="true"
                ></i>

                <h2 style="color:var(--primary-navy); margin-top:1rem;">
                    Recuperar senha
                </h2>

                <p style="color:var(--text-gray); font-size:0.9rem; line-height:1.5;">
                    Digite o e-mail cadastrado. O Supabase enviará um link seguro para você criar uma nova senha.
                </p>
            </div>

            <form
                onsubmit="processResetPassword(event, '${role}')"
                style="display:flex; flex-direction:column; gap:1.5rem;"
            >
                <div>
                    <label
                        for="res-email"
                        style="font-weight:bold; display:block; margin-bottom:0.5rem;"
                    >
                        E-mail cadastrado
                    </label>

                    <input
                        type="email"
                        id="res-email"
                        autocomplete="email"
                        required
                        placeholder="seuemail@instituicao.br"
                        style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;"
                    >
                </div>

                <button
                    type="submit"
                    style="width:100%; padding:1rem; border:none; cursor:pointer; font-weight:bold; background:var(--mint-teal); color:#005555; border-radius:8px;"
                >
                    Enviar link de recuperação
                </button>
            </form>

            <button
                onclick="renderLogin('${role}')"
                style="width:100%; padding:0.8rem; background:none; border:none; color:var(--text-gray); font-weight:bold; cursor:pointer; margin-top:1rem; text-decoration:underline;"
            >
                Voltar ao login
            </button>
        </div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
};

window.processResetPassword = async function(event, role) {
    event.preventDefault();

    const email = document
        .getElementById('res-email')
        .value
        .trim()
        .toLowerCase();

    const submitButton = event.submitter;

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
    }

    try {
        const supabaseClient = getSupabaseClient();

        const redirectTo =
            `${window.location.origin}${window.location.pathname}`;

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                email,
                { redirectTo }
            );

        if (error) throw error;

        alert(
            'Se esse e-mail estiver cadastrado, você receberá um link seguro para redefinir a senha.'
        );

        renderLogin(role);
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);

        alert(
            `Não foi possível enviar o link.\n\n${error.message}`
        );
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
                'Enviar link de recuperação';
        }
    }
};

window.renderUpdatePassword = function() {
    const c = document.getElementById('content-area');

    c.innerHTML = `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; background:var(--bg-light); padding:2rem;">
        <div style="background:var(--white); padding:clamp(2rem, 6vw, 4rem); border-radius:var(--border-radius); box-shadow:var(--shadow); max-width:450px; width:100%;">
            <h2 style="color:var(--primary-navy); margin-bottom:1rem;">
                Criar nova senha
            </h2>

            <p style="color:var(--text-gray); margin-bottom:2rem;">
                Escolha uma senha longa e exclusiva para o AlterECO.
            </p>

            <form
                onsubmit="processUpdatePassword(event)"
                style="display:flex; flex-direction:column; gap:1.5rem;"
            >
                <div>
                    <label
                        for="new-password"
                        style="font-weight:bold; display:block; margin-bottom:0.5rem;"
                    >
                        Nova senha
                    </label>

                    <input
                        type="password"
                        id="new-password"
                        minlength="12"
                        autocomplete="new-password"
                        required
                        style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;"
                    >
                </div>

                <div>
                    <label
                        for="confirm-password"
                        style="font-weight:bold; display:block; margin-bottom:0.5rem;"
                    >
                        Confirmar nova senha
                    </label>

                    <input
                        type="password"
                        id="confirm-password"
                        minlength="12"
                        autocomplete="new-password"
                        required
                        style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;"
                    >
                </div>

                <button
                    type="submit"
                    style="width:100%; padding:1rem; border:none; cursor:pointer; font-weight:bold; background:var(--primary-navy); color:white; border-radius:8px;"
                >
                    Salvar nova senha
                </button>
            </form>
        </div>
    </div>
    `;

    window.scrollTo(0, 0);
};

window.processUpdatePassword = async function(event) {
    event.preventDefault();

    const password =
        document.getElementById('new-password').value;

    const confirmation =
        document.getElementById('confirm-password').value;

    if (password !== confirmation) {
        alert('As duas senhas não são iguais.');
        return;
    }

    try {
        const supabaseClient = getSupabaseClient();

        const { error } =
            await supabaseClient.auth.updateUser({
                password
            });

        if (error) throw error;

        alert(
            'Senha alterada com sucesso. Entre novamente com sua nova senha.'
        );

        await logout();
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);

        alert(
            `Não foi possível alterar a senha.\n\n${error.message}`
        );
    }
};

if (window.alterecoSupabase) {
    window.alterecoSupabase.auth.onAuthStateChange(
        (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setTimeout(
                    () => window.renderUpdatePassword(),
                    0
                );
            }

            if (event === 'SIGNED_OUT') {
                clearAlterEcoSession();
            }
        }
    );
}


/* ════════════ CURADORIA — SUPABASE ════════════ */

window.submitCuratorPost = async function(event) {
    event.preventDefault();
    const submitButton = event.submitter;

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando para curadoria...';
        }

        const session = await getVerifiedAccess('curator');
        if (!session) throw new Error('Sessão de curadoria não encontrada.');

        const payload = {
            title: document.getElementById('cur-title').value.trim(),
            author_name: session.name,
            area: normalizeContentArea(
                document.getElementById('cur-area').value
            ),
            tags: normalizeTags(
                document.getElementById('cur-tags').value
            ),
            description: document.getElementById('cur-desc').value.trim(),
            external_url: normalizeExternalUrl(
                document.getElementById('cur-link').value
            ),
            image_url: normalizeExternalUrl(
                document.getElementById('cur-image')?.value
            ),
            status: 'pending',
            submitted_by: session.id
        };

        const client = getSupabaseClient();
        const { error } = await client
            .from('content_items')
            .insert(payload);

        if (error) throw error;

        alert(
            'Conteúdo enviado com segurança. Ele já está na fila da administração.'
        );

        await renderCuradorDashboard();
    } catch (error) {
        console.error('Erro ao enviar conteúdo:', error);
        alert(`Não foi possível enviar.\n\n${error.message}`);
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Cadastrar e enviar para aprovação';
        }
    }
};

window.renderCuradorDashboard = async function() {
    let session;

    try {
        session = await getVerifiedAccess('curator');
    } catch (error) {
        alert(error.message);
        return renderLogin('curador');
    }

    if (!session) return renderLogin('curador');

    const client = getSupabaseClient();
    const { data: ownItems, error } = await client
        .from('content_items')
        .select('id, title, area, status, submitted_at, rejection_reason')
        .eq('submitted_by', session.id)
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error(error);
        alert(`Não foi possível carregar suas submissões.\n\n${error.message}`);
    }

    const statusLabels = {
        pending: 'Aguardando análise',
        approved: 'Publicado',
        rejected: 'Não aprovado',
        archived: 'Arquivado'
    };

    const submissionsHtml = (ownItems || []).length
        ? (ownItems || []).map(item => `
            <article style="background:var(--white); border:1px solid rgba(128,128,128,.16); border-radius:14px; padding:1rem 1.2rem; margin-bottom:.8rem;">
                <div style="display:flex; justify-content:space-between; gap:1rem; align-items:flex-start;">
                    <div>
                        <strong style="color:var(--primary-navy);">${escapeHtml(item.title)}</strong>
                        <div style="font-size:.82rem; color:var(--text-gray); margin-top:.35rem;">
                            ${escapeHtml(item.area)} · ${escapeHtml(formatContentDate(item.submitted_at))}
                        </div>
                    </div>
                    <span class="page-badge" style="background:var(--bg-light); color:var(--primary-navy); white-space:nowrap;">
                        ${escapeHtml(statusLabels[item.status] || item.status)}
                    </span>
                </div>
                ${item.rejection_reason ? `
                    <p style="margin-top:.8rem; color:#9B1C1C; font-size:.86rem;">
                        Motivo: ${escapeHtml(item.rejection_reason)}
                    </p>
                ` : ''}
            </article>
        `).join('')
        : '<p style="color:var(--text-gray);">Você ainda não enviou conteúdos.</p>';

    const c = document.getElementById('content-area');
    document.querySelectorAll('.nav-btn').forEach(
        btn => btn.classList.remove('active')
    );

    c.innerHTML = `
    <div class="page-dark-hero">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
            <div>
                <span class="page-badge" style="background:var(--accent-orange);">Área Restrita</span>
                <h1>Painel da Curadoria</h1>
                <p>Bem-vinda, ${escapeHtml(session.name)}.</p>
            </div>
            <button onclick="logout()" style="background:rgba(255,255,255,.1); color:white; border:none; padding:10px 20px; border-radius:20px; cursor:pointer;">
                Sair
            </button>
        </div>
    </div>

    <div class="content-white-section" style="max-width:1100px; margin:0 auto; background:var(--bg-light); display:grid; grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr); gap:2rem; align-items:start;">
        <section>
            <h2 style="margin-bottom:2rem; color:var(--primary-navy);">Nova submissão</h2>

            <form onsubmit="submitCuratorPost(event)" style="display:flex; flex-direction:column; gap:1.5rem; background:var(--white); padding:clamp(1.5rem,4vw,3rem); border-radius:var(--border-radius); box-shadow:var(--shadow);">
                <div>
                    <label for="cur-title" style="display:block; font-weight:600; margin-bottom:.5rem;">Título</label>
                    <input type="text" id="cur-title" required minlength="3" maxlength="300" style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px;">
                </div>

                <div>
                    <label for="cur-area" style="display:block; font-weight:600; margin-bottom:.5rem;">Área de destino</label>
                    <select id="cur-area" required style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px;">
                        <option value="metodos">Métodos Substitutivos</option>
                        <option value="materiais">Materiais Didáticos</option>
                        <option value="publicacoes">Publicações</option>
                        <option value="legislacao">Legislação</option>
                        <option value="bases-dados">Bases de Dados</option>
                        <option value="eventos">Eventos</option>
                    </select>
                </div>

                <div>
                    <label for="cur-tags" style="display:block; font-weight:600; margin-bottom:.5rem;">Tags, separadas por vírgulas</label>
                    <input type="text" id="cur-tags" required placeholder="Ex.: Farmacologia, in vitro, ética" style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px;">
                </div>

                <div>
                    <label for="cur-desc" style="display:block; font-weight:600; margin-bottom:.5rem;">Descrição ou resumo</label>
                    <textarea id="cur-desc" rows="5" required minlength="10" maxlength="4000" style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px; font-family:inherit;"></textarea>
                </div>

                <div>
                    <label for="cur-link" style="display:block; font-weight:600; margin-bottom:.5rem;">Link externo, opcional</label>
                    <input type="url" id="cur-link" placeholder="https://" style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px;">
                </div>

                <div>
                    <label for="cur-image" style="display:block; font-weight:600; margin-bottom:.5rem;">URL de imagem, opcional</label>
                    <input type="url" id="cur-image" placeholder="https://" style="width:100%; padding:.9rem; border:1px solid rgba(128,128,128,.2); border-radius:8px;">
                    <p style="font-size:.8rem; color:var(--text-gray); margin-top:.45rem;">O envio direto de arquivos será conectado ao Supabase Storage na próxima etapa.</p>
                </div>

                <button type="submit" style="background:var(--primary-navy); color:white; padding:1.2rem; border:none; border-radius:8px; font-weight:bold; font-size:1rem; cursor:pointer;">
                    Cadastrar e enviar para aprovação
                </button>
            </form>
        </section>

        <aside style="background:var(--white); padding:1.5rem; border-radius:var(--border-radius); box-shadow:var(--shadow);">
            <h2 style="font-size:1.25rem; color:var(--primary-navy); margin-bottom:1rem;">Minhas submissões</h2>
            ${submissionsHtml}
        </aside>
    </div>`;

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
};

/* ════════════ ADMINISTRAÇÃO — SUPABASE ════════════ */

window.approvePost = async function(id) {
    if (!confirm('Aprovar e publicar este conteúdo?')) return;

    try {
        await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        const { error } = await client.rpc('approve_content_item', {
            content_id: id
        });
        if (error) throw error;

        await refreshApprovedContentCache();
        alert('Conteúdo aprovado e publicado.');
        await renderAdminDashboard('pending');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível aprovar.\n\n${error.message}`);
    }
};

window.rejectPost = async function(id) {
    const reason = prompt(
        'Informe o motivo da não aprovação. Ele poderá ser visto pela pessoa que enviou:'
    );
    if (reason === null) return;

    try {
        await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        const { error } = await client.rpc('reject_content_item', {
            content_id: id,
            reason: reason.trim() || null
        });
        if (error) throw error;

        alert('Conteúdo marcado como não aprovado.');
        await renderAdminDashboard('pending');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível rejeitar.\n\n${error.message}`);
    }
};

window.deleteApprovedPost = async function(id) {
    if (!confirm('Remover este conteúdo definitivamente da plataforma?')) return;

    try {
        await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        const { error } = await client
            .from('content_items')
            .delete()
            .eq('id', id);
        if (error) throw error;

        await refreshApprovedContentCache();
        alert('Conteúdo removido.');
        await renderAdminDashboard('approved');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível remover.\n\n${error.message}`);
    }
};

function renderPendingCard(post) {
    const tags = post.tags.map(tag => `
        <span class="pill-tag" style="background:#eee; color:var(--text-gray);">
            #${escapeHtml(tag)}
        </span>
    `).join('');

    return `
    <article style="background:var(--white); border-radius:var(--border-radius); padding:2rem; margin-bottom:2rem; box-shadow:var(--shadow); border-left:5px solid var(--accent-orange);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <div style="display:flex; gap:1.25rem; align-items:flex-start; min-width:0;">
                <div style="width:140px; height:100px; border-radius:8px; overflow:hidden; background:var(--bg-light); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px dashed #ccc;">
                    ${post.image
                        ? `<img src="${escapeHtml(post.image)}" alt="" style="width:100%; height:100%; object-fit:cover;">`
                        : '<span style="color:var(--text-gray); font-size:.8rem;">Sem imagem</span>'}
                </div>
                <div style="min-width:0;">
                    <button onclick="changePostDestination('${post.id}')" class="page-badge" style="border:none; margin-bottom:1rem; background:rgba(0,0,0,.05); color:var(--primary-navy); cursor:pointer;">
                        DESTINO: ${escapeHtml(post.area)}
                    </button>
                    <h3 style="color:var(--primary-navy); font-size:1.5rem; margin-bottom:.5rem;">${escapeHtml(post.title)}</h3>
                    <p style="font-size:.95rem; color:var(--text-gray);">Enviado por <strong>${escapeHtml(post.author)}</strong> — ${escapeHtml(post.date)}</p>
                </div>
            </div>

            <div style="display:flex; gap:.8rem; flex-wrap:wrap;">
                <button onclick="approvePost('${post.id}')" style="background:#E5F8ED; color:#2E7D32; border:none; padding:10px 20px; border-radius:30px; font-weight:bold; cursor:pointer;">Aprovar</button>
                <button onclick="rejectPost('${post.id}')" style="background:#FFF0F0; color:#D32F2F; border:none; padding:10px 20px; border-radius:30px; font-weight:bold; cursor:pointer;">Não aprovar</button>
            </div>
        </div>

        <p style="color:var(--text-gray); margin-bottom:.8rem; font-size:1.02rem; line-height:1.7; background:var(--bg-light); padding:1.5rem; border-radius:8px;">${escapeHtml(post.description)}</p>

        <div style="font-size:.88rem; color:var(--text-gray); margin-bottom:1.5rem; padding-left:1rem; border-left:2px solid rgba(128,128,128,.2);">
            <strong>Texto expandido:</strong> ${escapeHtml(post.long_description || 'Não preenchido.')}
        </div>

        <div style="margin-bottom:1.5rem; display:flex; gap:.5rem; flex-wrap:wrap;">${tags}</div>

        <div style="display:flex; justify-content:space-between; gap:1rem; align-items:center; border-top:1px solid rgba(128,128,128,.15); padding-top:1rem; flex-wrap:wrap;">
            ${post.url && post.url !== '#'
                ? `<a href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-orange); font-weight:bold; text-decoration:none;">Acessar fonte</a>`
                : '<span style="color:var(--text-gray); font-size:.9rem;">Sem link</span>'}

            <div style="display:flex; gap:.4rem; flex-wrap:wrap;">
                <button onclick="editPostField('${post.id}', 'title', 'Título')" style="background:none; border:1px solid rgba(128,128,128,.2); padding:6px 9px; border-radius:15px; cursor:pointer;">Título</button>
                <button onclick="editPostField('${post.id}', 'description', 'Descrição')" style="background:none; border:1px solid rgba(128,128,128,.2); padding:6px 9px; border-radius:15px; cursor:pointer;">Descrição</button>
                <button onclick="editPostField('${post.id}', 'long_description', 'Texto expandido')" style="background:none; border:1px solid rgba(128,128,128,.2); padding:6px 9px; border-radius:15px; cursor:pointer;">Texto longo</button>
                <button onclick="changePostUrl('${post.id}')" style="background:none; border:1px solid rgba(128,128,128,.2); padding:6px 9px; border-radius:15px; cursor:pointer;">Link</button>
                <button onclick="changePostImage('${post.id}')" style="background:none; border:1px solid rgba(128,128,128,.2); padding:6px 9px; border-radius:15px; cursor:pointer;">Imagem</button>
            </div>
        </div>
    </article>`;
}

window.renderAdminDashboard = async function(tab = 'pending') {
    let session;

    try {
        session = await getVerifiedAccess('admin');
    } catch (error) {
        alert(error.message);
        return renderLogin('admin');
    }

    if (!session) return renderLogin('admin');

    let pending = [];
    let approved = [];

    try {
        [pending, approved] = await Promise.all([
            fetchContentItemsByStatus('pending'),
            fetchContentItemsByStatus('approved')
        ]);
        alterecoContentCache.approved = approved;
        alterecoContentCache.loaded = true;
    } catch (error) {
        console.error(error);
        alert(`Não foi possível carregar os conteúdos.\n\n${error.message}`);
    }

    let contentHTML = '';

    if (tab === 'pending') {
        contentHTML = pending.length
            ? pending.map(renderPendingCard).join('')
            : `<div style="background:var(--white); border-radius:var(--border-radius); padding:4rem; text-align:center; box-shadow:var(--shadow);">
                <h3 style="color:var(--text-gray);">Nenhuma submissão pendente</h3>
                <p style="color:var(--text-gray);">Toda a curadoria está em dia.</p>
            </div>`;
    } else if (tab === 'approved') {
        contentHTML = approved.length
            ? approved.map(post => `
                <article style="background:var(--white); border-radius:var(--border-radius); padding:1.5rem; margin-bottom:1.5rem; border:1px solid rgba(128,128,128,.15); display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
                    <div>
                        <span class="page-badge" style="background:var(--bg-gray); color:var(--primary-navy); margin-bottom:.5rem;">${escapeHtml(post.area)}</span>
                        <h3 style="color:var(--primary-navy); font-size:1.3rem;">${escapeHtml(post.title)}</h3>
                        <p style="font-size:.9rem; color:var(--text-gray);">${escapeHtml(post.author)} · ${escapeHtml(post.date)}</p>
                    </div>
                    <button onclick="deleteApprovedPost('${post.id}')" style="background:none; border:2px solid #D32F2F; color:#D32F2F; padding:8px 16px; border-radius:8px; font-weight:bold; cursor:pointer;">Excluir</button>
                </article>
            `).join('')
            : '<div style="background:var(--white); padding:4rem; text-align:center; border-radius:var(--border-radius);"><p style="color:var(--text-gray);">Nenhum conteúdo publicado pelo painel.</p></div>';
    }

    const c = document.getElementById('content-area');
    document.querySelectorAll('.nav-btn').forEach(
        btn => btn.classList.remove('active')
    );

    c.innerHTML = `
    <div style="background:var(--white); border-bottom:1px solid rgba(128,128,128,.15); padding:1.5rem 2rem; display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; position:sticky; top:0; z-index:100;">
        <div>
            <h2 style="font-size:1.3rem; color:var(--primary-navy); font-weight:800;">DASHBOARD ADMIN</h2>
            <span style="color:var(--text-gray); font-size:.82rem;">${escapeHtml(session.name)}</span>
        </div>
        <div style="display:flex; gap:.6rem; flex-wrap:wrap;">
            <button onclick="renderAdminDashboard('pending')" style="border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold; ${tab === 'pending' ? 'background:var(--primary-navy); color:white;' : 'background:var(--bg-light); color:var(--text-gray);'}">Curadoria (${pending.length})</button>
            <button onclick="renderAdminDashboard('approved')" style="border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold; ${tab === 'approved' ? 'background:var(--primary-navy); color:white;' : 'background:var(--bg-light); color:var(--text-gray);'}">Publicados (${approved.length})</button>
            <button onclick="renderAdminDashboard('new')" style="background:var(--accent-orange); color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold;">Novo conteúdo</button>
            <button onclick="renderAdminDashboard('forum')" style="background:var(--bg-light); color:var(--text-gray); border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold;">Fórum</button>
            <button onclick="renderAdminSettings()" style="background:var(--bg-light); color:var(--text-gray); border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold;">Segurança</button>
            <button onclick="logout()" style="background:#FFF0F0; color:#D32F2F; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold;">Sair</button>
        </div>
    </div>

    <div style="max-width:1400px; margin:0 auto; padding:2rem; display:grid; grid-template-columns:minmax(0,2fr) minmax(300px,1fr); gap:2rem; align-items:start;">
        <main>
            <h2 style="font-size:1.8rem; color:var(--primary-navy); margin-bottom:2rem;">
                ${tab === 'pending' ? 'Aprovação de conteúdos' : tab === 'approved' ? 'Conteúdos publicados' : tab === 'new' ? 'Novo conteúdo' : 'Moderação do fórum'}
            </h2>
            <div id="admin-main-list">
                ${tab === 'forum'
                    ? renderForumModerationList()
                    : tab === 'new'
                        ? renderManualEntryForm()
                        : contentHTML}
            </div>
        </main>

        <aside style="position:sticky; top:120px;">
            <div style="background:var(--white); border-radius:20px; padding:2rem; border:1px solid rgba(128,128,128,.15); box-shadow:0 10px 40px rgba(0,0,0,.05);">
                <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
                    <img src="assets/eco.png" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <div>
                        <h3 style="font-size:1.1rem; color:var(--primary-navy);">ECO IA CURADORA</h3>
                        <span style="font-size:.75rem; color:#4DB6AC;">Integração protegida será a próxima etapa</span>
                    </div>
                </div>
                <p style="color:var(--text-gray); line-height:1.6; font-size:.9rem;">A IA permanece desativada para não expor a chave Gemini no navegador.</p>
                <button onclick="sendCommandToCurator()" style="width:100%; margin-top:1rem; background:var(--primary-navy); color:white; border:none; padding:14px; border-radius:12px; cursor:pointer; font-weight:bold;">Sobre a integração da IA</button>
            </div>
        </aside>
    </div>`;

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
};

async function updatePendingContentField(id, field, value) {
    await getVerifiedAccess('admin');
    const client = getSupabaseClient();

    const allowed = new Set([
        'title',
        'description',
        'long_description',
        'external_url',
        'image_url',
        'area',
        'tags'
    ]);

    if (!allowed.has(field)) {
        throw new Error('Campo não autorizado para edição.');
    }

    const { error } = await client
        .from('content_items')
        .update({ [field]: value })
        .eq('id', id)
        .eq('status', 'pending');

    if (error) throw error;
}

window.editPostField = async function(id, field, label) {
    const newValue = prompt(`Editar ${label}:`);
    if (newValue === null) return;

    try {
        await updatePendingContentField(id, field, newValue.trim());
        await renderAdminDashboard('pending');
    } catch (error) {
        alert(`Não foi possível editar.\n\n${error.message}`);
    }
};

window.changePostDestination = async function(id) {
    const newArea = prompt(
        'Digite a área: metodos, materiais, publicacoes, legislacao, bases-dados ou eventos'
    );
    if (newArea === null) return;

    const area = normalizeContentArea(newArea);

    try {
        await updatePendingContentField(id, 'area', area);
        await renderAdminDashboard('pending');
    } catch (error) {
        alert(`Não foi possível alterar.\n\n${error.message}`);
    }
};

window.changePostImage = async function(id) {
    const value = prompt('Cole uma URL HTTPS para a imagem, ou deixe vazio para remover:');
    if (value === null) return;

    const url = normalizeExternalUrl(value);
    if (value.trim() && !url) {
        alert('Use uma URL válida iniciada por https://');
        return;
    }

    try {
        await updatePendingContentField(id, 'image_url', url);
        await renderAdminDashboard('pending');
    } catch (error) {
        alert(`Não foi possível alterar.\n\n${error.message}`);
    }
};

window.handleLocalImageUpload = function() {
    alert('O upload de arquivos será conectado ao Supabase Storage na próxima etapa. Por enquanto, use uma URL HTTPS.');
};

window.changePostUrl = async function(id) {
    const value = prompt('Cole a URL oficial, ou deixe vazio para remover:');
    if (value === null) return;

    const url = normalizeExternalUrl(value);
    if (value.trim() && !url) {
        alert('Use uma URL válida iniciada por https://');
        return;
    }

    try {
        await updatePendingContentField(id, 'external_url', url);
        await renderAdminDashboard('pending');
    } catch (error) {
        alert(`Não foi possível alterar.\n\n${error.message}`);
    }
};

window.changePostDate = function() {
    alert('As datas agora são registradas automaticamente pelo Supabase e não podem ser alteradas manualmente.');
};

window.sendCommandToCurator = async function() {
    alert('A IA curadora está temporariamente desativada. Ela será ligada por uma Edge Function do Supabase, sem expor a chave Gemini.');
};

window.triggerAICuratorChat = function() {
    window.sendCommandToCurator();
};

window.shareCard = function(btn) {
    let cardTitle = 'Conteúdo AlterECO';
    const titleElement = btn.closest('div')?.parentElement?.querySelector(
        'h2, h3, .pub-card-title, .materiais-card-title, .legis-card-title, .db-card-name'
    );
    if (titleElement) cardTitle = titleElement.innerText.replace(/Postado por.*/g, '');

    if (navigator.clipboard && window.location.href) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
    }

    alert(`Compartilhar: ${cardTitle.trim()}\n\nLink da página copiado.`);
};

window.renderAdminSettings = async function() {
    let session;

    try {
        session = await getVerifiedAccess('admin');
    } catch (error) {
        alert(error.message);
        return renderLogin('admin');
    }

    const c = document.getElementById('content-area');

    c.innerHTML = `
    <div style="background:var(--white); border-bottom:1px solid rgba(128,128,128,0.15); padding:1.5rem 2rem; display:flex; justify-content:space-between; align-items:center;">
        <h2 style="font-size:1.3rem; color:var(--primary-navy); font-weight:800;">
            SEGURANÇA DA CONTA
        </h2>

        <button
            onclick="renderAdminDashboard()"
            style="background:var(--primary-navy); color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;"
        >
            Voltar ao Dashboard
        </button>
    </div>

    <div style="max-width:600px; margin:4rem auto; padding:2rem; background:var(--white); border:1px solid rgba(128,128,128,0.15); border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <h3 style="margin-bottom:2rem; color:var(--primary-navy);">
            Alterar meus dados
        </h3>

        <form
            onsubmit="updateAdminCredentials(event)"
            style="display:flex; flex-direction:column; gap:1.5rem;"
        >
            <div>
                <label
                    for="set-name"
                    style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;"
                >
                    Nome exibido no painel
                </label>

                <input
                    type="text"
                    id="set-name"
                    value="${session.name || ''}"
                    required
                    style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;"
                >
            </div>

            <div>
                <label
                    for="set-email"
                    style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;"
                >
                    E-mail de acesso
                </label>

                <input
                    type="email"
                    id="set-email"
                    value="${session.email || ''}"
                    required
                    style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;"
                >
            </div>

            <div>
                <label
                    for="set-pass"
                    style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;"
                >
                    Nova senha
                </label>

                <input
                    type="password"
                    id="set-pass"
                    minlength="12"
                    autocomplete="new-password"
                    placeholder="Deixe em branco para não alterar"
                    style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;"
                >
            </div>

            <button
                type="submit"
                style="background:var(--primary-navy); color:white; border:none; padding:1.2rem; border-radius:10px; font-weight:bold; cursor:pointer; font-size:1rem;"
            >
                Salvar alterações
            </button>
        </form>

        <p style="margin-top:1.5rem; color:var(--text-gray); font-size:0.85rem; line-height:1.5;">
            Se o e-mail for alterado, o Supabase poderá solicitar confirmação no endereço novo.
            Depois da alteração, será necessário entrar novamente.
        </p>
    </div>
    `;
};

window.updateAdminCredentials = async function(event) {
    event.preventDefault();

    const name =
        document.getElementById('set-name').value.trim();

    const email =
        document.getElementById('set-email').value.trim().toLowerCase();

    const password =
        document.getElementById('set-pass').value;

    const submitButton = event.submitter;

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';
    }

    try {
        const session = await getVerifiedAccess('admin');

        if (!session) {
            throw new Error('Sessão administrativa não encontrada.');
        }

        const supabaseClient = getSupabaseClient();

        const authChanges = {};

        if (email && email !== session.email) {
            authChanges.email = email;
        }

        if (password) {
            authChanges.password = password;
        }

        if (Object.keys(authChanges).length > 0) {
            const { error: authError } =
                await supabaseClient.auth.updateUser(authChanges);

            if (authError) throw authError;
        }

        const { error: profileError } =
            await supabaseClient
                .from('profiles')
                .update({ full_name: name })
                .eq('id', session.id);

        if (profileError) throw profileError;

        alert(
            'Dados atualizados. Por segurança, entre novamente.'
        );

        await logout();
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);

        alert(
            `Não foi possível salvar.\n\n${error.message}`
        );
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar alterações';
        }
    }
};

window.renderForumModerationList = function() {
    const forumPosts = JSON.parse(localStorage.getItem('altereco_forum_posts')) || [];
    const pending = forumPosts.filter(p => p.status === 'pending');

    if(pending.length === 0) return `<div style="text-align:center; padding:5rem; color:#bbb;">Nenhum tópico pendente de moderação.</div>`;

    return pending.map(post => `
        <div style="background:var(--white); border-radius:15px; padding:2rem; margin-bottom:1.5rem; border:1px solid rgba(128,128,128,0.2); box-shadow:0 5px 15px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <h3 style="margin:0; color:var(--primary-navy);">${post.title}</h3>
                <span style="font-size:0.8rem; color:var(--text-gray);">Autor: <strong>${post.author}</strong></span>
            </div>
            <p style="color:var(--text-gray); font-size:0.95rem; line-height:1.5; margin-bottom:1.5rem;">${post.body}</p>
            <div style="display:flex; gap:1rem; border-top:1px solid rgba(128,128,128,0.15); padding-top:1.5rem;">
                <button onclick="moderateForumPost('${post.id}', 'approved')" style="background:var(--mint-teal); color:#005555; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Aprovar Tópico</button>
                <button onclick="moderateForumPost('${post.id}', 'delete')" style="background:#FFF0F0; color:#D32F2F; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Excluir</button>
            </div>
        </div>
    `).join('');
};

window.moderateForumPost = function(id, action) {
    let posts = JSON.parse(localStorage.getItem('altereco_forum_posts')) || [];
    const idx = posts.findIndex(p => p.id === id);
    if(idx > -1){
        if(action === 'approved') {
            posts[idx].status = 'approved';
            alert('✅ Tópico aprovado e publicado no fórum!');
        } else {
            posts.splice(idx, 1);
            alert('🗑️ Tópico removido definitivamente.');
        }
        localStorage.setItem('altereco_forum_posts', JSON.stringify(posts));
        renderAdminDashboard('forum');
    }
};


window.renderManualEntryForm = function() {
    return `
    <div style="background:var(--white); padding:clamp(1.5rem,4vw,3rem); border-radius:20px; box-shadow:var(--shadow); border:1px solid rgba(128,128,128,.15);">
        <h3 style="color:var(--primary-navy); margin-bottom:2rem;">Cadastro administrativo de conteúdo</h3>

        <form onsubmit="processManualAdminPost(event)" style="display:flex; flex-direction:column; gap:1.5rem;">
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.5rem;">
                <div>
                    <label for="man-title" style="display:block; font-weight:700; margin-bottom:.5rem;">Título</label>
                    <input type="text" id="man-title" required minlength="3" maxlength="300" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                </div>
                <div>
                    <label for="man-author" style="display:block; font-weight:700; margin-bottom:.5rem;">Autor ou instituição</label>
                    <input type="text" id="man-author" required minlength="2" maxlength="200" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.5rem;">
                <div>
                    <label for="man-area" style="display:block; font-weight:700; margin-bottom:.5rem;">Área</label>
                    <select id="man-area" required style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                        <option value="publicacoes">Publicações</option>
                        <option value="metodos">Métodos Substitutivos</option>
                        <option value="materiais">Materiais Didáticos</option>
                        <option value="legislacao">Legislação</option>
                        <option value="bases-dados">Bases de Dados</option>
                        <option value="eventos">Eventos</option>
                    </select>
                </div>
                <div>
                    <label for="man-tags" style="display:block; font-weight:700; margin-bottom:.5rem;">Tags</label>
                    <input type="text" id="man-tags" placeholder="Bioética, PDF, livro" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                </div>
            </div>

            <div>
                <label for="man-desc" style="display:block; font-weight:700; margin-bottom:.5rem;">Resumo ou descrição</label>
                <textarea id="man-desc" rows="5" required minlength="10" maxlength="4000" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px; font-family:inherit;"></textarea>
            </div>

            <div>
                <label for="man-long-desc" style="display:block; font-weight:700; margin-bottom:.5rem;">Texto expandido, opcional</label>
                <textarea id="man-long-desc" rows="6" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px; font-family:inherit;"></textarea>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.5rem;">
                <div>
                    <label for="man-link" style="display:block; font-weight:700; margin-bottom:.5rem;">Link externo</label>
                    <input type="url" id="man-link" placeholder="https://" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                </div>
                <div>
                    <label for="man-image" style="display:block; font-weight:700; margin-bottom:.5rem;">URL da imagem</label>
                    <input type="url" id="man-image" placeholder="https://" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,.2); border-radius:12px;">
                </div>
            </div>

            <div style="background:var(--bg-light); padding:1.3rem; border-radius:12px; color:var(--text-gray); font-size:.88rem;">
                O sistema cria o registro como pendente e o aprova por uma função protegida. Isso mantém a mesma trilha de segurança dos demais conteúdos.
            </div>

            <button type="submit" style="background:var(--primary-navy); color:white; padding:1.2rem; border:none; border-radius:15px; font-weight:800; font-size:1.05rem; cursor:pointer;">
                Publicar agora
            </button>
        </form>
    </div>`;
};

window.processManualAdminPost = async function(event) {
    event.preventDefault();
    const submitButton = event.submitter;

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Publicando...';
        }

        const session = await getVerifiedAccess('admin');
        if (!session) throw new Error('Sessão administrativa não encontrada.');

        const payload = {
            title: document.getElementById('man-title').value.trim(),
            author_name: document.getElementById('man-author').value.trim(),
            area: normalizeContentArea(document.getElementById('man-area').value),
            tags: normalizeTags(document.getElementById('man-tags').value),
            description: document.getElementById('man-desc').value.trim(),
            long_description: document.getElementById('man-long-desc').value.trim() || null,
            external_url: normalizeExternalUrl(document.getElementById('man-link').value),
            image_url: normalizeExternalUrl(document.getElementById('man-image').value),
            status: 'pending',
            submitted_by: session.id
        };

        const client = getSupabaseClient();
        const { data, error: insertError } = await client
            .from('content_items')
            .insert(payload)
            .select('id')
            .single();

        if (insertError) throw insertError;

        const { error: approvalError } = await client.rpc(
            'approve_content_item',
            { content_id: data.id }
        );

        if (approvalError) throw approvalError;

        await refreshApprovedContentCache();
        alert('Conteúdo publicado com sucesso.');
        await renderAdminDashboard('approved');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível publicar.\n\n${error.message}`);
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Publicar agora';
        }
    }
};

refreshApprovedContentCache();
