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

/* ════════════ AUTHENTICATION ════════════ */

window.processLogin = function(event, role) {
    event.preventDefault();
    const email = document.getElementById('log-email').value;
    const pass = document.getElementById('log-pass').value;
    const users = JSON.parse(localStorage.getItem('altereco_users'));
    const user = users.find(u => u.email === email && u.pass === pass && u.role === role);
    
    if (user) {
        sessionStorage.setItem('altereco_session', JSON.stringify({ role: user.role, name: user.name, email: user.email }));
        if(role === 'admin') renderAdminDashboard();
        else renderCuradorDashboard();
    } else {
        alert('Credenciais incorretas ou acesso restrito.');
    }
};

window.logout = function() {
    sessionStorage.removeItem('altereco_session');
    location.reload();
};

function renderLogin(role) {
    const c = document.getElementById('content-area');
    const title = role === 'admin' ? 'Acesso Administrativo' : 'Painel do Curador';
    
    c.innerHTML = `
    <div style="min-height: 80vh; display:flex; align-items:center; justify-content:center; background: var(--bg-light);">
        <div style="background:var(--white); padding: 4rem; border-radius: var(--border-radius); box-shadow: var(--shadow); max-width: 450px; width:100%;">
            <div style="text-align:center; margin-bottom: 2rem;">
                <i data-lucide="${role === 'admin' ? 'shield-check' : 'user-check'}" style="width:64px; height:64px; color:var(--primary-navy);"></i>
                <h2 style="color:var(--primary-navy); margin-top: 1rem;">${title}</h2>
                <p style="color:var(--text-gray); font-size: 0.9rem;">Área protegida</p>
            </div>
            <form onsubmit="processLogin(event, '${role}')" style="display:flex; flex-direction:column; gap:1.5rem;">
                <div>
                     <label style="font-weight:bold; display:block; margin-bottom:0.5rem;">Email Institucional</label>
                     <input type="email" id="log-email" required placeholder="ex: ${role}@altereco.org" style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;">
                </div>
                <div>
                     <label style="font-weight:bold; display:block; margin-bottom:0.5rem;">Senha Segura</label>
                     <input type="password" id="log-pass" required placeholder="Sua senha secreta" style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;">
                </div>
                <button type="submit" style="width:100%; padding:1rem; border:none; cursor:pointer; font-weight:bold; font-size:1.1rem; background:var(--primary-navy); color:white; border-radius:8px; transition:0.3s;">Entrar no Sistema</button>
            </form>
            
            <div style="display:flex; justify-content:center; margin-top:1.5rem; font-size:0.9rem; font-weight:500;">
                <a href="#" onclick="event.preventDefault(); renderResetPassword('${role}');" style="color:var(--text-gray); text-decoration:underline;">Esqueceu a senha?</a>
            </div>
        </div>
    </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0,0);
}

window.renderResetPassword = function(role) {
    const c = document.getElementById('content-area');
    c.innerHTML = `
    <div style="min-height: 80vh; display:flex; align-items:center; justify-content:center; background: var(--bg-light);">
        <div style="background:var(--white); padding: 4rem; border-radius: var(--border-radius); box-shadow: var(--shadow); max-width: 450px; width:100%;">
            <div style="text-align:center; margin-bottom: 2rem;">
                <i data-lucide="key" style="width:64px; height:64px; color:var(--mint-teal);"></i>
                <h2 style="color:var(--primary-navy); margin-top: 1rem;">Alterar Senha</h2>
                <p style="color:var(--text-gray); font-size: 0.9rem;">Redefinição para ${role === 'admin' ? 'Administração' : 'Curadoria'}</p>
            </div>
            <form onsubmit="processResetPassword(event, '${role}')" style="display:flex; flex-direction:column; gap:1.5rem;">
                <div>
                     <label style="font-weight:bold; display:block; margin-bottom:0.5rem;">Email Institucional Cadastrado</label>
                     <input type="email" id="res-email" required placeholder="Seu email cadastrado" style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;">
                </div>
                <div>
                     <label style="font-weight:bold; display:block; margin-bottom:0.5rem;">Nova Senha</label>
                     <input type="password" id="res-pass" required placeholder="Mínimo 6 caracteres" minlength="6" style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;">
                </div>
                <div>
                     <label style="font-weight:bold; display:block; margin-bottom:0.5rem;">Confirmar Nova Senha</label>
                     <input type="password" id="res-pass-conf" required placeholder="Repita a senha" style="width:100%; padding:0.9rem; border:1px solid rgba(128,128,128,0.2); border-radius:8px;">
                </div>
                <button type="submit" style="width:100%; padding:1rem; border:none; cursor:pointer; font-weight:bold; font-size:1.1rem; background:var(--mint-teal); color:#005555; border-radius:8px; transition:0.3s;">Salvar Nova Senha</button>
            </form>
            
            <button onclick="renderLogin('${role}')" style="width:100%; padding:0.8rem; background:none; border:none; color:var(--text-gray); font-weight:bold; cursor:pointer; margin-top:1rem; text-decoration:underline;">Voltar ao Login</button>
        </div>
    </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0,0);
};

window.processResetPassword = function(event, role) {
    event.preventDefault();
    const email = document.getElementById('res-email').value;
    const newPass = document.getElementById('res-pass').value;
    const confPass = document.getElementById('res-pass-conf').value;

    if (newPass !== confPass) {
        alert("Atenção: As novas senhas digitadas não coincidem. Tente novamente.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('altereco_users'));
    const userIndex = users.findIndex(u => u.email === email && u.role === role);
    
    if (userIndex > -1) {
        users[userIndex].pass = newPass;
        localStorage.setItem('altereco_users', JSON.stringify(users));
        alert('✅ Senha redefinida com sucesso! Você já pode fazer login com a nova senha.');
        renderLogin(role);
    } else {
        alert('❌ Erro: Email não encontrado no sistema para o status de ' + role + '. Certifique-se de usar o mesmo email do cadastro.');
    }
};


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

window.renderCuradorDashboard = function() {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    if (!session || session.role !== 'curador') return renderLogin('curador');

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

window.renderAdminDashboard = function(tab = 'pending') {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    if (!session || session.role !== 'admin') return renderLogin('admin');

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
    const input = document.getElementById('admin-ai-input');
    const chat = document.getElementById('admin-ai-chat');
    const text = input.value.trim();
    if(!text) return;
    
    // User message
    const uMsg = document.createElement('div');
    uMsg.style.cssText = "background:#EEF2F6; padding:1rem; border-radius:15px; font-size:0.9rem; align-self:flex-end; max-width:85%; color:#333;";
    uMsg.innerText = text;
    chat.appendChild(uMsg);
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Loading
    const lMsg = document.createElement('div');
    lMsg.innerText = "🤖 ECO IA está analisando...";
    lMsg.style.cssText = "font-size:0.8rem; color:var(--text-gray); margin:5px;";
    chat.appendChild(lMsg);

    try {
        const apiKey = CONFIG.GEMINI_API_KEY;
        const systemPrompt = `Você é a ECO IA Curadora da AlterECO. Sua tarefa é encontrar e estruturar conteúdos reais e modernos sobre MÉTODOS SUBSTITUTIVOS AO USO DE ANIMAIS (3Rs).
        REGRAS DE RESPOSTA:
        1. Responda em Português do Brasil.
        2. Primeiro, mande um texto curto amigável.
        3. Depois, mande OBRIGATORIAMENTE um bloco: [JSON_START] [{...}, {...}] [JSON_END].
        4. No JSON inclua: title, author (ECO IA), area (publicacoes/metodos/materiais/legislacao/bases-dados), tags (lista), description, url, image.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [ 
                    { role: 'user', parts: [{ text: "INSTRUÇÕES: " + systemPrompt }] },
                    { role: 'model', parts: [{ text: "Entendido, sou a ECO IA Curadora. O que deseja buscar?" }] },
                    { role: 'user', parts: [{ text: text }] } 
                ] 
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            const errMsg = data.error ? data.error.message : "Erro na rede";
            lMsg.innerHTML = `<span style="color:#D32F2F;">❌ ERRO: ${errMsg}</span>`;
            return;
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
             lMsg.innerText = "❌ Sem resposta da IA.";
             return;
        }

        const aiFullText = data.candidates[0].content.parts[0].text;
        lMsg.remove();
        
        const chatPart = aiFullText.split('[JSON_START]')[0].trim();
        const jsonPartRaw = aiFullText.match(/\[JSON_START\](.*?)\[JSON_END\]/s);
        
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = "background:#F9F1D2; padding:1rem; border-radius:15px; font-size:0.9rem; color:#333;";
        aiMsg.innerText = chatPart || "Resultados da curadoria:";
        chat.appendChild(aiMsg);
        
        if(jsonPartRaw) {
            try {
                const results = JSON.parse(jsonPartRaw[1].trim());
                let pending = getPendingPosts();
                results.forEach(r => { r.id = Date.now() + Math.random(); pending.push(r); });
                localStorage.setItem('altereco_pending_posts', JSON.stringify(pending));
                renderAdminDashboard('pending');
                const okMsg = document.createElement('div');
                okMsg.style.cssText = "font-size:0.8rem; color:#2E7D32; font-weight:bold; margin-top:5px;";
                okMsg.innerText = `✅ ECO IA inseriu ${results.length} itens na fila.`;
                chat.appendChild(okMsg);
            } catch(e) { console.error("JSON Error", e); }
        }
        chat.scrollTop = chat.scrollHeight;
        if (window.lucide) window.lucide.createIcons();

    } catch(err) {
        console.error("Critical Error:", err);
        lMsg.innerHTML = "❌ FALHA CRÍTICA DE CONEXÃO.";
    }
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
window.renderAdminSettings = function() {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    const c = document.getElementById('content-area');
    
    c.innerHTML = `
    <div style="background:var(--white); border-bottom:1px solid rgba(128,128,128,0.15); padding: 1.5rem 2rem; display:flex; justify-content:space-between; align-items:center;">
        <h2 style="font-size:1.3rem; color:var(--primary-navy); font-weight:800;">SEGURANÇA DA CONTA</h2>
        <button onclick="renderAdminDashboard()" style="background:var(--primary-navy); color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;">Voltar ao Dashboard</button>
    </div>
    
    <div style="max-width: 600px; margin: 4rem auto; padding: 2rem; background:var(--white); border:1px solid rgba(128,128,128,0.15); border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <h3 style="margin-bottom:2rem; color:var(--primary-navy);">Alterar Credenciais Administrativas</h3>
        
        <form onsubmit="updateAdminCredentials(event)" style="display:flex; flex-direction:column; gap:1.5rem;">
            <div>
                <label style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;">Seu Nome (Exibido no Painel)</label>
                <input type="text" id="set-name" value="${session.name}" required style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;">
            </div>
            <div>
                <label style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;">Email de Acesso</label>
                <input type="email" id="set-email" value="${session.email}" required style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;">
            </div>
            <div>
                <label style="display:block; font-weight:bold; margin-bottom:0.5rem; font-size:0.9rem;">Nova Senha</label>
                <input type="password" id="set-pass" placeholder="Deixe em branco para não alterar" style="width:100%; padding:1rem; border:1px solid rgba(128,128,128,0.2); border-radius:10px;">
            </div>
            <button type="submit" style="background:var(--primary-navy); color:white; border:none; padding:1.2rem; border-radius:10px; font-weight:bold; cursor:pointer; font-size:1rem;">Salvar Novas Credenciais</button>
        </form>
    </div>
    `;
};

window.updateAdminCredentials = function(e) {
    e.preventDefault();
    const name = document.getElementById('set-name').value;
    const email = document.getElementById('set-email').value;
    const pass = document.getElementById('set-pass').value;
    
    let users = JSON.parse(localStorage.getItem('altereco_users'));
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    
    const userIndex = users.findIndex(u => u.email === session.email);
    if(userIndex > -1){
        users[userIndex].name = name;
        users[userIndex].email = email;
        if(pass) users[userIndex].pass = pass;
        
        localStorage.setItem('altereco_users', JSON.stringify(users));
        alert('Credenciais atualizadas com sucesso! Por segurança, faça login novamente.');
        logout();
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
