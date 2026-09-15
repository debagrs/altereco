/* ══════════════════════════════════════════════════════
   ALTERECO — Extensões do Dashboard Admin
   Agenda curada + moderação de respostas do fórum.
══════════════════════════════════════════════════════ */

(function extendAdminDashboard() {
    if (typeof window.renderAdminDashboard !== 'function') return;
    const originalRenderAdminDashboard = window.renderAdminDashboard;

    function injectAgendaButton(active = false) {
        const forumButton = document.querySelector("button[onclick*=\"renderAdminDashboard('forum')\"]");
        if (!forumButton || document.getElementById('ae-admin-events-tab')) return;
        const button = document.createElement('button');
        button.id = 'ae-admin-events-tab';
        button.type = 'button';
        button.textContent = 'Agenda';
        button.setAttribute('onclick', "renderAdminDashboard('events')");
        button.style.cssText = `border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:bold; ${active ? 'background:var(--primary-navy); color:white;' : 'background:var(--bg-light); color:var(--text-gray);'}`;
        forumButton.insertAdjacentElement('afterend', button);
    }

    window.renderAdminDashboard = async function(tab = 'pending') {
        if (tab === 'events') {
            await originalRenderAdminDashboard('pending');
            injectAgendaButton(true);
            const mainList = document.getElementById('admin-main-list');
            const heading = mainList?.parentElement?.querySelector('h2');
            if (heading) heading.textContent = 'Curadoria da agenda';
            await window.aeRenderAdminEventsModeration('pending');
            return;
        }

        await originalRenderAdminDashboard(tab);
        injectAgendaButton(false);
    };
})();

function aeAdminEventDate(value) {
    if (!value) return '';
    const [y, m, d] = value.slice(0, 10).split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(y, m - 1, d, 12));
}

function aeAdminEventEditor(event) {
    const approved = event.status === 'approved';
    return `
        <article style="background:var(--white); border:1px solid rgba(128,128,128,.18); border-radius:16px; padding:1.4rem; margin-bottom:1rem; box-shadow:0 5px 18px rgba(0,0,0,.035);">
            <div style="display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; flex-wrap:wrap; margin-bottom:1rem;">
                <div>
                    <div style="display:flex; gap:.45rem; flex-wrap:wrap; margin-bottom:.55rem;">
                        <span class="page-badge">${escapeHtml(event.event_kind || 'evento')}</span>
                        <span class="page-badge" style="background:var(--bg-gray); color:var(--text-dark);">${escapeHtml(event.format || '')}</span>
                        ${approved ? '<span class="page-badge" style="background:#dff6e9; color:#17633f;">Publicado</span>' : '<span class="page-badge" style="background:#fff3cf; color:#6a5313;">Pendente</span>'}
                    </div>
                    <h3 style="color:var(--text-dark); font-size:1.25rem; margin:0 0 .35rem;">${escapeHtml(event.title)}</h3>
                    <p style="color:var(--text-gray); margin:0;">${escapeHtml(aeAdminEventDate(event.start_date))}${event.end_date && event.end_date !== event.start_date ? ` — ${escapeHtml(aeAdminEventDate(event.end_date))}` : ''}</p>
                </div>
                ${event.source_url ? `<a href="${escapeHtml(event.source_url)}" target="_blank" rel="noopener noreferrer" style="font-weight:700; color:var(--text-dark);">Abrir fonte ↗</a>` : ''}
            </div>

            <details>
                <summary style="cursor:pointer; font-weight:700; color:var(--primary-navy); padding:.6rem 0;">Revisar / editar dados</summary>
                <form class="ae-admin-event-form" onsubmit="aeSaveAdminEvent(event, '${event.id}')" style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; padding-top:1rem;">
                    <label style="grid-column:1/-1; font-weight:700; color:var(--text-dark);">Título<input name="title" value="${escapeHtml(event.title)}" required maxlength="180" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">Organização<input name="organizer" value="${escapeHtml(event.organizer || '')}" required maxlength="180" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">Tipo<select name="event_kind" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);">${['congresso','conferencia','simposio','encontro','curso','webinar','workshop','prazo','outro'].map(kind => `<option value="${kind}" ${event.event_kind === kind ? 'selected' : ''}>${kind}</option>`).join('')}</select></label>
                    <label style="font-weight:700; color:var(--text-dark);">Data inicial<input type="date" name="start_date" value="${escapeHtml(event.start_date || '')}" required style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">Data final<input type="date" name="end_date" value="${escapeHtml(event.end_date || event.start_date || '')}" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">Formato<select name="format" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);">${['presencial','online','hibrido'].map(format => `<option value="${format}" ${event.format === format ? 'selected' : ''}>${format}</option>`).join('')}</select></label>
                    <label style="font-weight:700; color:var(--text-dark);">Local<input name="location" value="${escapeHtml(event.location || '')}" maxlength="180" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">Cidade<input name="city" value="${escapeHtml(event.city || '')}" maxlength="120" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="font-weight:700; color:var(--text-dark);">País<input name="country" value="${escapeHtml(event.country || '')}" maxlength="120" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="grid-column:1/-1; font-weight:700; color:var(--text-dark);">Fonte oficial<input type="url" name="source_url" value="${escapeHtml(event.source_url || '')}" required style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);"></label>
                    <label style="grid-column:1/-1; font-weight:700; color:var(--text-dark);">Descrição<textarea name="description" rows="4" required maxlength="1200" style="width:100%; margin-top:.4rem; padding:.8rem; border-radius:9px; border:1px solid rgba(128,128,128,.25); background:var(--bg-light); color:var(--text-dark);">${escapeHtml(event.description || '')}</textarea></label>
                    <div style="grid-column:1/-1; display:flex; justify-content:flex-end;"><button type="submit" style="background:var(--primary-navy); color:white; border:0; border-radius:9px; padding:10px 18px; font-weight:700; cursor:pointer;">Salvar revisão</button></div>
                </form>
            </details>

            <div style="display:flex; gap:.7rem; flex-wrap:wrap; border-top:1px solid rgba(128,128,128,.15); padding-top:1rem; margin-top:1rem;">
                ${approved
                    ? `<button onclick="aeModerateAdminEvent('${event.id}','reject')" style="background:#fff3cf; color:#6a5313; border:0; border-radius:9px; padding:10px 16px; font-weight:700; cursor:pointer;">Retirar da agenda</button>`
                    : `<button onclick="aeModerateAdminEvent('${event.id}','approve')" style="background:var(--mint-teal); color:#154d46; border:0; border-radius:9px; padding:10px 16px; font-weight:700; cursor:pointer;">Aprovar e publicar</button>
                       <button onclick="aeModerateAdminEvent('${event.id}','reject')" style="background:#fff3cf; color:#6a5313; border:0; border-radius:9px; padding:10px 16px; font-weight:700; cursor:pointer;">Rejeitar</button>`}
                <button onclick="aeModerateAdminEvent('${event.id}','delete')" style="background:#fff0f0; color:#b32a2a; border:0; border-radius:9px; padding:10px 16px; font-weight:700; cursor:pointer;">Excluir</button>
                ${event.submitter_name ? `<span style="margin-left:auto; align-self:center; color:var(--text-gray); font-size:.85rem;">Sugerido por ${escapeHtml(event.submitter_name)}</span>` : ''}
            </div>
        </article>`;
}

window.aeRenderAdminEventsModeration = async function(filter = 'pending') {
    const main = document.getElementById('admin-main-list');
    if (!main) return;
    main.innerHTML = '<div style="padding:3rem; text-align:center; color:var(--text-gray);">Carregando agenda…</div>';

    try {
        await getVerifiedAccess('admin');
        const { data, error } = await getSupabaseClient()
            .from('events')
            .select('*')
            .eq('status', filter)
            .order('start_date', { ascending: filter !== 'approved' });
        if (error) throw error;

        main.innerHTML = `
            <div style="display:flex; gap:.6rem; flex-wrap:wrap; margin-bottom:1.2rem;">
                <button onclick="aeRenderAdminEventsModeration('pending')" style="border:0; border-radius:9px; padding:10px 16px; cursor:pointer; font-weight:700; ${filter === 'pending' ? 'background:var(--primary-navy);color:white;' : 'background:var(--bg-light);color:var(--text-gray);'}">Pendentes</button>
                <button onclick="aeRenderAdminEventsModeration('approved')" style="border:0; border-radius:9px; padding:10px 16px; cursor:pointer; font-weight:700; ${filter === 'approved' ? 'background:var(--primary-navy);color:white;' : 'background:var(--bg-light);color:var(--text-gray);'}">Publicados</button>
                <button onclick="renderPage('eventos')" style="margin-left:auto; border:0; border-radius:9px; padding:10px 16px; cursor:pointer; font-weight:700; background:var(--accent-yellow); color:var(--on-accent);">Ver agenda pública</button>
            </div>
            ${data?.length ? data.map(aeAdminEventEditor).join('') : `<div style="text-align:center; padding:4rem; background:var(--white); border-radius:16px; color:var(--text-gray);">Nenhum evento ${filter === 'pending' ? 'aguardando sua revisão' : 'publicado'}.</div>`}`;
    } catch (error) {
        console.error(error);
        main.innerHTML = `<div style="background:#fff1f1; color:#8b2e2e; padding:1.5rem; border-radius:12px;"><strong>Agenda ainda não ativada no banco.</strong><br>${escapeHtml(error.message)}<br><br>O pacote inclui a migration <code>20260915090000_agenda_forum_community.sql</code>.</div>`;
    }
};

window.aeSaveAdminEvent = async function(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    button.disabled = true;
    button.textContent = 'Salvando…';
    try {
        await getVerifiedAccess('admin');
        const payload = {
            title: form.title.value.trim(),
            organizer: form.organizer.value.trim(),
            event_kind: form.event_kind.value,
            start_date: form.start_date.value,
            end_date: form.end_date.value || form.start_date.value,
            format: form.format.value,
            location: form.location.value.trim() || null,
            city: form.city.value.trim() || null,
            country: form.country.value.trim() || null,
            source_url: form.source_url.value.trim(),
            description: form.description.value.trim()
        };
        const { error } = await getSupabaseClient().from('events').update(payload).eq('id', id);
        if (error) throw error;
        alert('Revisão salva.');
        await aeRenderAdminEventsModeration('pending');
    } catch (error) {
        alert(`Não foi possível salvar.\n\n${error.message}`);
    } finally {
        button.disabled = false;
        button.textContent = 'Salvar revisão';
    }
};

window.aeModerateAdminEvent = async function(id, action) {
    try {
        const session = await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        if (action === 'delete') {
            if (!confirm('Excluir este evento definitivamente?')) return;
            const { error } = await client.from('events').delete().eq('id', id);
            if (error) throw error;
        } else if (action === 'approve') {
            const { error } = await client.from('events').update({
                status: 'approved',
                reviewed_by: session.id,
                reviewed_at: new Date().toISOString(),
                verified_at: new Date().toISOString(),
                rejection_reason: null
            }).eq('id', id);
            if (error) throw error;
        } else {
            const reason = prompt('Motivo da rejeição/retirada (opcional):') || null;
            const { error } = await client.from('events').update({
                status: 'rejected',
                reviewed_by: session.id,
                reviewed_at: new Date().toISOString(),
                rejection_reason: reason
            }).eq('id', id);
            if (error) throw error;
        }
        await aeRenderAdminEventsModeration(action === 'approve' ? 'pending' : 'pending');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível moderar o evento.\n\n${error.message}`);
    }
};

/* Fórum: substitui somente a montagem da lista de moderação.
   O dashboard original continua responsável por autenticação e layout. */
window.renderForumModerationList = async function() {
    try {
        await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        const [topicsResult, repliesResult] = await Promise.all([
            client.from('forum_topics').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
            client.from('forum_replies').select('*').eq('status', 'pending').order('created_at', { ascending: false })
        ]);
        if (topicsResult.error) throw topicsResult.error;
        if (repliesResult.error) throw repliesResult.error;

        const topics = topicsResult.data || [];
        const replies = repliesResult.data || [];
        let titleMap = new Map();
        if (replies.length) {
            const ids = [...new Set(replies.map(reply => reply.topic_id))];
            const { data: parentTopics } = await client.from('forum_topics').select('id,title').in('id', ids);
            titleMap = new Map((parentTopics || []).map(item => [item.id, item.title]));
        }

        if (!topics.length && !replies.length) {
            return '<div style="text-align:center; padding:5rem; color:var(--text-gray); background:var(--white); border-radius:16px;">Fórum em dia: nenhum tópico ou resposta pendente.</div>';
        }

        return `
            <div style="display:grid; gap:1.6rem;">
                <section>
                    <h3 style="color:var(--text-dark); margin-bottom:1rem;">Tópicos pendentes (${topics.length})</h3>
                    ${topics.length ? topics.map(post => `
                        <article style="background:var(--white); border-radius:15px; padding:1.5rem; margin-bottom:1rem; border:1px solid rgba(128,128,128,.2);">
                            <div style="display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:.7rem;"><h4 style="margin:0; color:var(--text-dark); font-size:1.15rem;">${escapeHtml(post.title)}</h4><span class="page-badge">${escapeHtml(post.category || 'Discussão')}</span></div>
                            <p style="font-size:.82rem; color:var(--text-gray); margin-bottom:.7rem;">Autor: <strong>${escapeHtml(post.author_name || 'Participante')}</strong></p>
                            <p style="color:var(--text-gray); line-height:1.55; white-space:pre-wrap;">${escapeHtml(post.body)}</p>
                            <div style="display:flex; gap:.7rem; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(128,128,128,.12);"><button onclick="moderateForumPost('${post.id}','approved')" style="background:var(--mint-teal); color:#154d46; border:0; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Aprovar tópico</button><button onclick="moderateForumPost('${post.id}','delete')" style="background:#fff0f0; color:#b32a2a; border:0; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Excluir</button></div>
                        </article>`).join('') : '<p style="color:var(--text-gray);">Nenhum tópico aguardando moderação.</p>'}
                </section>
                <section>
                    <h3 style="color:var(--text-dark); margin-bottom:1rem;">Respostas pendentes (${replies.length})</h3>
                    ${replies.length ? replies.map(reply => `
                        <article style="background:var(--white); border-radius:15px; padding:1.5rem; margin-bottom:1rem; border:1px solid rgba(128,128,128,.2);">
                            <p style="font-size:.82rem; color:var(--text-gray); margin-bottom:.5rem;">Em: <strong>${escapeHtml(titleMap.get(reply.topic_id) || 'Tópico')}</strong> · por <strong>${escapeHtml(reply.author_name || 'Participante')}</strong></p>
                            <p style="color:var(--text-gray); line-height:1.55; white-space:pre-wrap;">${escapeHtml(reply.body)}</p>
                            <div style="display:flex; gap:.7rem; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(128,128,128,.12);"><button onclick="aeModerateForumReply('${reply.id}','approved')" style="background:var(--mint-teal); color:#154d46; border:0; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Aprovar resposta</button><button onclick="aeModerateForumReply('${reply.id}','delete')" style="background:#fff0f0; color:#b32a2a; border:0; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Excluir</button></div>
                        </article>`).join('') : '<p style="color:var(--text-gray);">Nenhuma resposta aguardando moderação.</p>'}
                </section>
            </div>`;
    } catch (error) {
        console.error(error);
        return `<div style="background:#fff1f1; color:#8b2e2e; padding:1.5rem; border-radius:12px;">Não foi possível carregar a moderação: ${escapeHtml(error.message)}</div>`;
    }
};

window.aeModerateForumReply = async function(id, action) {
    try {
        const session = await getVerifiedAccess('admin');
        const client = getSupabaseClient();
        if (action === 'approved') {
            const { error } = await client.from('forum_replies').update({
                status: 'approved', reviewed_by: session.id, reviewed_at: new Date().toISOString(), rejection_reason: null
            }).eq('id', id);
            if (error) throw error;
        } else {
            if (!confirm('Excluir esta resposta definitivamente?')) return;
            const { error } = await client.from('forum_replies').delete().eq('id', id);
            if (error) throw error;
        }
        await renderAdminDashboard('forum');
    } catch (error) {
        console.error(error);
        alert(`Não foi possível moderar a resposta.\n\n${error.message}`);
    }
};
