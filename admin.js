/* ══════════════════════════════════════════════════════
   ADMIN & CURATOR DASHBOARD LOGIC
   Handles Auth, Submissions, Approvals, and Deletion
══════════════════════════════════════════════════════ */

if (!localStorage.getItem('altereco_pending_posts')) localStorage.setItem('altereco_pending_posts', JSON.stringify([]));
if (!localStorage.getItem('altereco_approved_posts')) localStorage.setItem('altereco_approved_posts', JSON.stringify([]));

// Mock Accounts for Security Simulation
if (!localStorage.getItem('altereco_users')) {
    localStorage.setItem('altereco_users', JSON.stringify([
        { email: 'deboraaitagasparetto@gmail.com', pass: 'debora123', role: 'admin', name: 'Débora' },
        { email: 'curador@altereco.org', pass: 'curador123', role: 'curador', name: 'Curador Oficial' }
    ]));
}

function getPendingPosts() { return JSON.parse(localStorage.getItem('altereco_pending_posts')); }
function getApprovedPosts() { return JSON.parse(localStorage.getItem('altereco_approved_posts')); }

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

/* ════════════ CURATOR FLOW ════════════ */

window.submitCuratorPost = function(event) {
    event.preventDefault();
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    const title = document.getElementById('cur-title').value;
    const author = session ? session.name : document.getElementById('cur-author').value;
    const area = document.getElementById('cur-area').value;
    const tags = document.getElementById('cur-tags').value.split(',').map(t => t.trim());
    const desc = document.getElementById('cur-desc').value;
    const link = document.getElementById('cur-link').value || '#';

    const post = {
        id: Date.now().toString(),
        title, author, area, tags, description: desc, url: link, date: new Date().toLocaleDateString()
    };

    const pending = getPendingPosts();
    pending.push(post);
    localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));

    alert('✅ Arquivos e dados enviados com sucesso! Aguardando aprovação da Administração.');
    renderCuradorDashboard(); 
};

window.renderCuradorDashboard = async function() {
    let session;

    try {
        session = await getVerifiedAccess('curator');
    } catch (error) {
        console.error('Acesso à curadoria negado:', error);
        alert(error.message);
        return renderLogin('curador');
    }

    if (!session) return renderLogin('curador');

    const c = document.getElementById('content-area');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    c.innerHTML = `
    <div class="page-dark-hero">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span class="page-badge" style="background: var(--accent-orange);">Área Restrita</span>
                <h1>Painel do Curador</h1>
            </div>
            <button onclick="logout()" style="background:rgba(255,255,255,0.1); color:white; border:none; padding:10px 20px; border-radius:20px; cursor:pointer;" title="Sair da Conta">Sair <i data-lucide="log-out" style="width:16px;"></i></button>
        </div>
        <p>Bem-vindo(a), ${session.name}. Arraste e envie novos materiais.</p>
    </div>
    <div class="content-white-section" style="max-width: 800px; margin: 0 auto; background: var(--bg-light);">
        <h2 style="margin-bottom: 2rem; color: var(--primary-navy);">Nova Submissão de Conteúdo</h2>
        
        <form onsubmit="submitCuratorPost(event)" style="display:flex; flex-direction:column; gap: 1.5rem; background:var(--white); padding: 3rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
            <div id="drop-zone" style="border: 2px dashed #bbb; border-radius: var(--border-radius); padding: 3rem; text-align: center; cursor: pointer; transition: 0.3s; background:var(--bg-light);">
                <i data-lucide="upload-cloud" style="width: 48px; height: 48px; color:var(--text-gray); margin-bottom: 1rem;"></i>
                <p style="color:var(--text-gray); font-weight: 600;">Arraste e solte arquivos aqui ou clique para selecionar</p>
                <p style="font-size: 0.85rem; color:var(--text-gray); margin-top: 5px;">Suporta anexos PDF, imagens ou planilhas</p>
                <input type="file" id="file-input" style="display:none;" />
            </div>

            <div>
                <label style="display:block; font-weight:600; margin-bottom:0.5rem;">Título da Postagem</label>
                <input type="text" id="cur-title" required style="width:100%; padding: 0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius: 8px;">
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr; gap: 1.5rem;">
                <div>
                    <label style="display:block; font-weight:600; margin-bottom:0.5rem;">Área Predeterminada de Destino</label>
                    <select id="cur-area" required style="width:100%; padding: 0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius: 8px;">
                        <option value="metodos">Métodos Substitutivos</option>
                        <option value="materiais">Materiais Didáticos</option>
                        <option value="publicacoes">Publicações</option>
                        <option value="legislacao">Legislação</option>
                        <option value="bases">Bases de Dados</option>
                    </select>
                </div>
            </div>

            <div>
                <label style="display:block; font-weight:600; margin-bottom:0.5rem;">Sistema de Tags sobre o Assunto (separe por vírgulas)</label>
                <input type="text" id="cur-tags" required placeholder="Ex: Farmacologia, In vitro, Ética no Ensino" style="width:100%; padding: 0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius: 8px;">
            </div>

            <div>
                <label style="display:block; font-weight:600; margin-bottom:0.5rem;">Descrição / Resumo</label>
                <textarea id="cur-desc" rows="4" required style="width:100%; padding: 0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius: 8px;"></textarea>
            </div>
            
            <div>
                <label style="display:block; font-weight:600; margin-bottom:0.5rem;">Link Externo (Opcional)</label>
                <input type="url" id="cur-link" placeholder="https://" style="width:100%; padding: 0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius: 8px;">
            </div>

            <button type="submit" style="background: var(--primary-navy); color: white; padding: 1.2rem; border:none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor:pointer; width:100%; text-align:center; display:flex; align-items:center; justify-content:center; gap:8px;">
                Cadastrar e Enviar para Aprovação <span class="material-icons" aria-hidden="true" style="font-size:18px;">send</span>
            </button>
        </form>
    </div>
    `;

    setTimeout(() => {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        if(dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-orange)'; });
            dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dropZone.style.borderColor = '#ccc'; });
            dropZone.addEventListener('drop', (e) => { 
                e.preventDefault(); dropZone.style.borderColor = '#ccc'; 
                if(e.dataTransfer.files.length > 0) {
                    dropZone.innerHTML = `<i data-lucide="file-video" style="color:var(--mint-teal); width:48px; height:48px; margin-bottom: 1rem;"></i><p style="font-weight:bold; color:var(--primary-navy);">${e.dataTransfer.files[0].name}</p><p style="font-size: 0.85rem; color:var(--text-gray);">Arquivo anexado para publicação</p>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            });
            fileInput.addEventListener('change', (e) => {
                if(e.target.files.length > 0) {
                    dropZone.innerHTML = `<i data-lucide="file-check-2" style="color:var(--mint-teal); width:48px; height:48px; margin-bottom: 1rem;"></i><p style="font-weight:bold; color:var(--primary-navy);">${e.target.files[0].name}</p><p style="font-size: 0.85rem; color:var(--text-gray);">Arquivo selecionado</p>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            });
        }
    }, 100);

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
};


/* ════════════ ADMIN FLOW ════════════ */

window.approvePost = function(id) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const post = pending[postIndex];
        let approved = getApprovedPosts();
        approved.push(post);
        localStorage.setItem('altereco_approved_posts', JSON.stringify(approved));
        
        pending.splice(postIndex, 1);
        localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
        
        alert(`✅ Post "${post.title}" aprovado e publicado!`);
        renderAdminDashboard('pending');
    }
};

window.rejectPost = function(id) {
    if(!confirm("Atenção: O post da curadoria será deletado definitivamente. Tem certeza?")) return;
    let pending = getPendingPosts();
    pending = pending.filter(p => String(p.id) !== String(id));
    localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
    alert('❌ Post rejeitado com sucesso.');
    renderAdminDashboard('pending');
};

window.deleteApprovedPost = function(id) {
    if(!confirm("CUIDADO: Isso removerá o conteúdo do ar imediatamente. Confirmar Exclusão?")) return;
    let approved = getApprovedPosts();
    approved = approved.filter(p => String(p.id) !== String(id));
    localStorage.setItem('altereco_approved_posts', JSON.stringify(approved));
    alert('🗑️ Conteúdo removido da plataforma!');
    renderAdminDashboard('approved');
};

window.renderAdminDashboard = async function(tab = 'pending') {
    let session;

    try {
        session = await getVerifiedAccess('admin');
    } catch (error) {
        console.error('Acesso administrativo negado:', error);
        alert(error.message);
        return renderLogin('admin');
    }

    if (!session) return renderLogin('admin');

    const c = document.getElementById('content-area');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Tab lists
    const pending = getPendingPosts();
    const approved = getApprovedPosts();
    
    let contentHTML = '';

    if (tab === 'pending') {
        if(pending.length === 0){
            contentHTML = '<div style="background:var(--white); border-radius:var(--border-radius); padding: 4rem; text-align:center; box-shadow: var(--shadow);"><i data-lucide="shield-check" style="width:64px; height:64px; color:#ddd; margin-bottom:1rem;"></i><h3 style="color:var(--text-gray);">Nenhuma submissão pendente</h3><p style="color:var(--text-gray);">Toda a curadoria está em dia.</p></div>';
        } else {
            contentHTML = pending.map(p => `
            <div style="background:var(--white); border-radius: var(--border-radius); padding: 2rem; margin-bottom: 2rem; box-shadow: var(--shadow); border-left: 5px solid var(--accent-orange);">
                <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                    <div style="display:flex; gap: 1.5rem; align-items:flex-start;">
                        <div style="position:relative; overflow:hidden; border-radius:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 140px; height: 100px; flex-shrink:0; background:var(--bg-light); display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px dashed #ccc;">
                            ${p.image ? `<img src="${p.image}" alt="Preview" style="position:absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; z-index:0;">` : `<div style="z-index:0; text-align:center;"><i data-lucide="image-plus" style="width:24px; color:var(--text-gray);"></i><div style="font-size:0.7rem; color:var(--text-gray); margin-top:4px;">Sem Imagem</div></div>`}
                            <div style="position:absolute; bottom:0; left:0; right:0; display:flex; font-size:0.65rem; text-align:center; z-index:10;">
                                <div onclick="changePostImage('${p.id}')" style="flex:1; background:rgba(0,0,0,0.7); color:white; padding:4px; cursor:pointer;" title="Colar Link URL">🔗 URL</div>
                                <div onclick="document.getElementById('upload-img-${p.id}').click()" style="flex:1; background:rgba(30,100,50,0.8); color:white; padding:4px; cursor:pointer; border-left:1px solid #555;" title="Enviar do Computador">📁 PC</div>
                            </div>
                            <input type="file" id="upload-img-${p.id}" accept="image/*" style="display:none;" onchange="handleLocalImageUpload(event, '${p.id}')">
                        </div>
                        <div>
                            <span onclick="changePostDestination('${p.id}')" class="page-badge" style="margin-bottom:1rem; background: rgba(0,0,0,0.05); color: var(--primary-navy); text-transform:uppercase; cursor:pointer;" title="Clique para editar destino">DESTINO: ${p.area} <i data-lucide="edit-2" style="width:12px; margin-left:4px;"></i></span>
                            <h3 style="color: var(--primary-navy); font-size: 1.5rem; margin-bottom: 0.5rem;">${p.title}</h3>
                            <p style="font-size: 0.95rem; color:var(--text-gray);">Enviado por: <strong>${p.author}</strong> — ${p.date}</p>
                        </div>
                    </div>
                    <div style="display:flex; gap: 0.8rem;">
                        <button onclick="approvePost('${p.id}')" style="background:#E5F8ED; color:#2E7D32; border:none; padding: 10px 20px; border-radius:30px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px; transition:0.3s; box-shadow:0 3px 10px rgba(0,0,0,0.05);">Aprovar <i data-lucide="check" style="width:16px;"></i></button>
                        <button onclick="rejectPost('${p.id}')" style="background:#FFF0F0; color:#D32F2F; border:none; padding: 10px 20px; border-radius:30px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px; transition:0.3s;">Rejeitar <i data-lucide="x" style="width:16px;"></i></button>
                    </div>
                </div>
                <p style="color: var(--text-gray); margin-bottom: 0.5rem; font-size:1.05rem; line-height: 1.7; background:var(--bg-light); padding: 1.5rem; border-radius: 8px;">${p.description}</p>
                <div style="font-size:0.85rem; color:var(--text-gray); margin-bottom:1.5rem; border-left:2px solid rgba(128,128,128,0.2); padding-left:1rem;">
                    <strong>Texto Expandido (Long):</strong> ${p.long_description || 'Nenhum texto longo preenchido.'}
                </div>
                
                <div style="margin-bottom: 1.5rem; display:flex; gap: 0.5rem; flex-wrap:wrap;">
                    ${p.tags.map(t => `<span class="pill-tag" style="background:#eee; color:var(--text-gray);">#${t}</span>`).join('')}
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(128,128,128,0.15); padding-top:1rem; flex-wrap:wrap; gap:10px;">
                    ${p.url && p.url !== '#' ? `<a href="${p.url}" target="_blank" style="color: var(--accent-orange); font-size:0.95rem; font-weight:bold; text-decoration:none;"><i data-lucide="link" style="width:16px; display:inline; margin-right:4px; vertical-align:middle;"></i> Acessar fonte</a>` : `<span style="color:var(--text-gray); font-size:0.9rem;">Sem link</span>`}
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                        <button onclick="editPostField('${p.id}', 'title', 'Título do Conteúdo')" style="background:none; border:1px solid rgba(128,128,128,0.2); color:var(--text-gray); padding:5px 8px; border-radius:15px; font-size:0.7rem; cursor:pointer;">✏️ Título</button>
                        <button onclick="editPostField('${p.id}', 'description', 'Descrição Curta (UX Writing)')" style="background:none; border:1px solid rgba(128,128,128,0.2); color:var(--text-gray); padding:5px 8px; border-radius:15px; font-size:0.7rem; cursor:pointer;">✏️ Descrição</button>
                        <button onclick="editPostField('${p.id}', 'long_description', 'Texto Expandido do Post')" style="background:none; border:1px solid rgba(128,128,128,0.2); color:var(--text-gray); padding:5px 8px; border-radius:15px; font-size:0.7rem; cursor:pointer;">📝 Texto Longo</button>
                        <button onclick="changePostDate('${p.id}')" style="background:none; border:1px solid rgba(128,128,128,0.2); color:var(--text-gray); padding:5px 8px; border-radius:15px; font-size:0.7rem; cursor:pointer;">📅 Data</button>
                        <button onclick="changePostUrl('${p.id}')" style="background:none; border:1px solid rgba(128,128,128,0.2); color:var(--text-gray); padding:5px 8px; border-radius:15px; font-size:0.7rem; cursor:pointer;">🔗 Link</button>
                    </div>
                </div>
            </div>`).join('');
        }
    } else {
        // Render Approved content tab for Deletion
        if(approved.length === 0){
             contentHTML = '<div style="background:var(--white); border-radius:var(--border-radius); padding: 4rem; text-align:center; box-shadow: var(--shadow);"><i data-lucide="folder-search" style="width:64px; height:64px; color:#ddd; margin-bottom:1rem;"></i><h3 style="color:var(--text-gray);">Nenhum conteúdo dinâmico inserido no ar.</h3></div>';
        } else {
            contentHTML = approved.map(p => `
            <div style="background:var(--white); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.5rem; border:1px solid rgba(128,128,128,0.15); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span class="page-badge" style="background:var(--bg-gray); color:var(--primary-navy); margin-bottom:0.5rem;">Página: ${p.area}</span>
                    <h3 style="color:var(--primary-navy); font-size:1.3rem;">${p.title}</h3>
                    <p style="font-size:0.9rem; color:var(--text-gray);">Autor: ${p.author} | Publicado em ${p.date}</p>
                </div>
                <div>
                     <button onclick="deleteApprovedPost('${p.id}')" style="background:none; border:2px solid #D32F2F; color:#D32F2F; padding: 8px 16px; border-radius:8px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px; transition:0.3s;"><i data-lucide="trash-2" style="width:16px;"></i> Excluir Definitivamente</button>
                </div>
            </div>`).join('');
        }
    }

    c.innerHTML = `
    <div style="background:var(--white); border-bottom:1px solid rgba(128,128,128,0.15); padding: 1.5rem 2rem; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:100;">
        <div style="display:flex; align-items:center; gap: 1rem;">
            <div style="width:50px; height:50px; background:var(--primary-navy); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white;">
                <i data-lucide="shield" style="width:24px;"></i>
            </div>
            <div>
                <h2 style="font-size:1.3rem; color:var(--primary-navy); font-weight:800;">DASHBOARD ADMIN</h2>
                <div style="display:flex; gap: 0.5rem; align-items:center;">
                    <span class="page-badge" style="background:#E5F8ED; color:#2E7D32;">Acesso Nível 1 - Master</span>
                    <span style="color:var(--text-gray); font-size:0.8rem;">Logado como ${session.name}</span>
                </div>
            </div>
        </div>
        <div style="display:flex; gap: 1rem;">
             <button onclick="renderAdminDashboard('approved')" class="nav-btn ${tab === 'approved' ? 'active' : ''}" style="background:none; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; color:var(--text-gray);">Publicados (${approved.length})</button>
             <button onclick="renderAdminDashboard('pending')" class="nav-btn ${tab === 'pending' ? 'active' : ''}" style="background:none; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; color:var(--text-gray);">Curadoria (${pending.length})</button>
             <button onclick="renderAdminDashboard('new')" class="nav-btn ${tab === 'new' ? 'active' : ''}" style="background:var(--primary-navy); color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:5px;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">add_circle</span> Novo Conteúdo</button>
             <button onclick="renderAdminDashboard('forum')" class="nav-btn ${tab === 'forum' ? 'active' : ''}" style="background:none; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; color:var(--text-gray);">Fórum</button>
             <button onclick="renderAdminSettings()" class="nav-btn" style="background:#f0f0f0; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; color:var(--text-gray);"><i data-lucide="settings" style="width:16px; vertical-align:middle;"></i> Segurança</button>
             <button onclick="logout()" style="background:#FFF0F0; color:#D32F2F; border:none; padding: 10px 20px; border-radius:10px; font-weight:bold; cursor:pointer;">Sair</button>
        </div>
    </div>

    <div style="max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 2fr 1.2fr; gap: 2rem; align-items: flex-start;">
        <!-- Left: Queue -->
        <div>
            <div style="margin-bottom: 2rem; display:flex; justify-content:space-between; align-items:center;">
                <h2 style="font-size:1.8rem; font-weight:800; color:var(--primary-navy);">${tab === 'pending' ? 'Aprovação de Conteúdos' : 'Conteúdos em Produção'}</h2>
            </div>
            <div id="admin-main-list">
                ${tab === 'forum' ? renderForumModerationList() : (tab === 'new' ? renderManualEntryForm() : contentHTML)}
            </div>
        </div>

        <!-- Right: AI Assistant -->
        <div style="position: sticky; top: 120px;">
            <div id="ai-curator-console" style="background:var(--white); border-radius: 20px; padding: 2rem; border:1px solid rgba(128,128,128,0.15); box-shadow: 0 10px 40px rgba(0,0,0,0.05); min-height: 500px; display:flex; flex-direction:column;">
                <div style="display:flex; align-items:center; gap: 1rem; margin-bottom:1.5rem; border-bottom:1px solid rgba(128,128,128,0.15); padding-bottom:1rem;">
                    <img src="assets/eco.png" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <div>
                        <h3 style="font-size:1.1rem; color:var(--primary-navy); font-weight:700;">ECO IA CURADORA</h3>
                        <span style="font-size:0.75rem; color:#4DB6AC;">Console de Curação Inteligente</span>
                    </div>
                </div>
                
                <div id="admin-ai-chat" style="flex:1; overflow-y:auto; max-height: 400px; padding-bottom:1rem; display:flex; flex-direction:column; gap:1rem;">
                    <div style="background:var(--bg-light); padding:1.2rem; border-radius:15px; font-size:0.9rem; color:var(--text-gray); line-height:1.5;">
                        "Olá, ${session.name.split(' ')[0]}! Sou sua assistente curadora. Peça algo como: <strong>'Encontre editais abertos na Espanha para biotecnologia'</strong> ou <strong>'Sugira 3 novos congressos de fisiologia sem animais'</strong>."
                    </div>
                </div>
                
                <div style="margin-top:1rem; border-top:1px solid rgba(128,128,128,0.15); padding-top:1.5rem;">
                    <textarea id="admin-ai-input" placeholder="Comande a IA aqui..." style="width:100%; height:80px; border:1px solid rgba(128,128,128,0.15); background:var(--bg-light); border-radius:15px; padding:1rem; font-family:inherit; resize:none; font-size:0.9rem; outline:none;"></textarea>
                    <button onclick="sendCommandToCurator()" id="send-ai-btn" style="width:100%; margin-top:0.8rem; background:var(--primary-navy); color:white; border:none; padding:15px; border-radius:15px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                        Conversar com IA <i data-lucide="send" style="width:16px;"></i>
                    </button>
                    <p style="font-size:0.7rem; color:var(--text-gray); margin-top:1rem; text-align:center;">As sugestões aprovadas pela IA cairão direto na sua fila ao lado.</p>
                </div>
            </div>
        </div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
};

window.editPostField = function(id, field, label) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const current = pending[postIndex][field] || '';
        const newValue = prompt(`Editar ${label}:`, current);
        if (newValue !== null) {
            pending[postIndex][field] = newValue.trim();
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    }
};

window.changePostDestination = function(id) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const current = pending[postIndex].area;
        const newArea = prompt("Mudança de Destino Rápida\\n\\nDigite a nova área (ex: materiais, publicacoes, bases-dados, legislacao):", current);
        if (newArea && newArea.trim() !== current) {
            pending[postIndex].area = newArea.trim().toLowerCase();
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    }
};

window.changePostImage = function(id) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const current = pending[postIndex].image || '';
        const newImage = prompt("Deseja alterar a miniatura do conteúdo?\\nCole a nova URL de imagem, ou deixe vazio para remover:", current);
        if (newImage !== null) {
            pending[postIndex].image = newImage.trim();
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    }
};

window.handleLocalImageUpload = function(event, id) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        let pending = getPendingPosts();
        const postIndex = pending.findIndex(p => String(p.id) === String(id));
        if (postIndex > -1) {
            pending[postIndex].image = e.target.result;
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    };
    reader.readAsDataURL(file);
};

window.changePostUrl = function(id) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const current = pending[postIndex].url || '';
        const newUrl = prompt("Editar Link da Chamada Público ou Evento:\nCole a URL oficial de destino (ou '#' para limpar):", current);
        if (newUrl !== null) {
            pending[postIndex].url = newUrl.trim() || '#';
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    }
};

window.changePostDate = function(id) {
    let pending = getPendingPosts();
    const postIndex = pending.findIndex(p => String(p.id) === String(id));
    if(postIndex > -1){
        const current = pending[postIndex].date || '';
        const newDate = prompt("Editar Data do Conteúdo/Evento:\nExemplo: '15/Maio' ou '2025-06-20'", current);
        if (newDate !== null) {
            pending[postIndex].date = newDate.trim();
            localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
            renderAdminDashboard('pending');
        }
    }
};

window.sendCommandToCurator = async function() {
    alert(
        'A IA curadora foi temporariamente desativada por segurança. ' +
        'A chave antiga estava no navegador. Na próxima etapa, vamos ' +
        'ligá-la por uma função protegida do Supabase.'
    );
};

window.triggerAICuratorChat = function() {
    const input = document.getElementById('admin-ai-input');
    input.focus();
    input.classList.add('pulse-highlight');
    setTimeout(() => input.classList.remove('pulse-highlight'), 1000);
};

window.getDynamicPostsForArea = function(areaId) {
    return getApprovedPosts().filter(p => p.area === areaId);
};

window.shareCard = function(btn) {
    let cardTitle = "Conteúdo AlterECO";
    const titleElement = btn.closest('div').parentElement.querySelector('h2, h3, .pub-card-title, .materiais-card-title, .legis-card-title, .db-card-name');
    if (titleElement) cardTitle = titleElement.innerText.replace(/Postado por.*/g, '');
    alert(`Compartilhar: "\n${cardTitle.trim()}"\n\nLink copiado para a área de transferência! Envie para WhatsApp ou E-mail.`);
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
    <div style="background:var(--white); padding: 3rem; border-radius: 20px; box-shadow: var(--shadow); border:1px solid rgba(128,128,128,0.15);">
        <h3 style="color: var(--primary-navy); margin-bottom: 2rem; display:flex; align-items:center; gap:10px;"><i data-lucide="edit-3"></i> Cadastro Manual de Conteúdo</h3>
        
        <form onsubmit="processManualAdminPost(event)" style="display:flex; flex-direction:column; gap:1.5rem;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Título da Publicação / Método</label>
                    <input type="text" id="man-title" required placeholder="Ex: Bioética na Ciência" style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem;">
                </div>
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Autor(a) ou Instituição</label>
                    <input type="text" id="man-author" required placeholder="Ex: Rita Leal Paixão" style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem;">
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Área de Destino</label>
                    <select id="man-area" required style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem; cursor:pointer;">
                        <option value="publicacoes">Publicações (Livros/Artigos)</option>
                        <option value="metodos">Métodos Substitutivos</option>
                        <option value="materiais">Materiais Didáticos</option>
                        <option value="legislacao">Legislação</option>
                        <option value="bases">Bases de Dados</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Tags (separe por vírgula)</label>
                    <input type="text" id="man-tags" placeholder="Ex: Bioética, PDF, Livro" style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem;">
                </div>
            </div>

            <div>
                <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Resumo / Descrição (IA Sugestiva pode ser inserida aqui)</label>
                <textarea id="man-desc" rows="5" required placeholder="Escreva um pequeno resumo do conteúdo..." style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem; resize:vertical; font-family:inherit;"></textarea>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">Link Externo (URL)</label>
                    <input type="url" id="man-link" placeholder="https://" style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem;">
                </div>
                <div>
                    <label style="display:block; font-weight:700; margin-bottom:0.5rem; font-size:0.9rem;">URL da Imagem (Capa do Livro)</label>
                    <input type="url" id="man-image" placeholder="https://... ou vazio para padrão" style="width:100%; padding: 1rem; border:1px solid rgba(128,128,128,0.2); border-radius: 12px; font-size:1rem;">
                </div>
            </div>

            <div style="background:var(--bg-light); padding: 1.5rem; border-radius: 12px; border: 1px solid #e0e4e7;">
                <p style="font-size:0.85rem; color:var(--text-gray); margin:0;"><strong>Dica:</strong> Como você é Administradora, este conteúdo será publicado <strong>imediatamente</strong> na seção escolhida sem passar pela fila de aprovação.</p>
            </div>

            <button type="submit" style="background: var(--primary-navy); color: white; padding: 1.2rem; border:none; border-radius: 15px; font-weight: 800; font-size: 1.1rem; cursor:pointer; width:100%; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top:1rem; transition:0.3s;">
                Publicar Agora na Plataforma <i data-lucide="check" style="width:20px; margin-left:8px;"></i>
            </button>
        </form>
    </div>
    `;
};

window.processManualAdminPost = function(event) {
    event.preventDefault();
    const title = document.getElementById('man-title').value;
    const author = document.getElementById('man-author').value;
    const area = document.getElementById('man-area').value;
    const tags = document.getElementById('man-tags').value.split(',').map(t => t.trim()).filter(t => t !== '');
    const desc = document.getElementById('man-desc').value;
    const url = document.getElementById('man-link').value || '#';
    const image = document.getElementById('man-image').value;

    const post = {
        id: Date.now().toString(),
        title, author, area, tags, description: desc, url, image,
        date: new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'long'})
    };

    let approved = getApprovedPosts();
    approved.push(post);
    localStorage.setItem('altereco_approved_posts', JSON.stringify(approved));

    alert('🚀 Sucesso! O conteúdo foi publicado diretamente na plataforma.');
    renderAdminDashboard('approved');
};
