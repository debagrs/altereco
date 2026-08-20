/**
 * ALTERECO — ECO IA
 * Frontend seguro: a chave Gemini nunca chega ao navegador.
 * Conversas são processadas e persistidas pela Edge Function `ai-eco`.
 */

(function () {
    "use strict";

    const AI_STORAGE_KEY = "altereco-ai-session-v2";

    function getAIConfig() {
        return {
            functionName: CONFIG?.AI?.FUNCTION_NAME || "ai-eco",
            modelLabel: CONFIG?.AI?.MODEL_LABEL || "Gemini 3.5 Flash",
            maxChars: CONFIG?.AI?.MAX_MESSAGE_CHARS || 3000
        };
    }

    function createVisitorToken() {
        if (window.crypto?.randomUUID) {
            return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
        }
        return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    }

    function loadAISession() {
        try {
            const current = JSON.parse(localStorage.getItem(AI_STORAGE_KEY) || "null");
            if (current?.visitorToken) return current;
        } catch (_) {
            // Recria abaixo.
        }

        const fresh = {
            visitorToken: createVisitorToken(),
            conversationId: null,
            mode: null
        };
        localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
    }

    function saveAISession(session) {
        localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(session));
    }

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatSafeMessage(text = "") {
        return escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>");
    }

    async function invokeAIEdge(body) {
        if (!window.alterecoSupabase) {
            throw new Error("A conexão com o Supabase não foi carregada.");
        }

        const { functionName } = getAIConfig();
        const { data, error } = await window.alterecoSupabase.functions.invoke(
            functionName,
            { body }
        );

        if (error) {
            let message = error.message || "Falha ao chamar a ECO IA.";
            try {
                const context = await error.context?.json?.();
                if (context?.error) message = context.error;
            } catch (_) {
                // Mantém a mensagem original.
            }
            throw new Error(message);
        }

        if (!data || data.error) {
            throw new Error(data?.error || "A ECO IA não retornou uma resposta válida.");
        }

        return data;
    }

    async function initAIECOInterface(container) {
        const aiConfig = getAIConfig();
        const persistentSession = loadAISession();

        container.innerHTML = `
            <div class="chat-wrapper" style="max-width:720px; margin:0 auto; background:#F4F7F9; min-height:78vh; height:80vh; display:flex; flex-direction:column; border-radius:30px; overflow:hidden; box-shadow:var(--shadow); border:1px solid #eee;">
                <div class="chat-header" style="background:white; padding:1.25rem 1.5rem; display:flex; align-items:center; gap:1rem; border-bottom:1px solid #eee;">
                    <button id="chat-back" aria-label="Voltar" style="background:none; border:none; cursor:pointer;"><i data-lucide="arrow-left" style="color:#777;"></i></button>
                    <div style="width:46px; height:46px; border-radius:50%; overflow:hidden; flex-shrink:0;">
                        <img src="assets/eco.png" alt="ECO" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="flex:1; min-width:0;">
                        <h3 style="margin:0; font-size:1.1rem; color:#333;">ECO · Assistente AlterECO</h3>
                        <span id="ai-status" style="font-size:.8rem; color:#4D6A57;">${escapeHtml(aiConfig.modelLabel)} · conexão protegida</span>
                    </div>
                    <button id="clear-chat" title="Apagar esta conversa" aria-label="Apagar esta conversa" style="background:none; border:none; color:#999; cursor:pointer;"><i data-lucide="trash-2" style="width:20px;"></i></button>
                </div>

                <div id="interaction-selector" style="padding:2rem; display:flex; flex-direction:column; gap:1rem; flex:1; align-items:center; justify-content:center; text-align:center; overflow:auto;">
                    <span style="font-size:.78rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#4D6A57;">Educação humanitária · 1R · métodos substitutivos</span>
                    <h4 style="color:var(--primary-navy); margin:.25rem 0 1rem; font-size:1.35rem;">Como a ECO pode ajudar?</h4>
                    <div style="display:grid; grid-template-columns:1fr; gap:1rem; width:100%; max-width:500px;">
                        ${persistentSession.conversationId ? `<button class="ai-option-btn ai-resume-btn" data-context="resume"><strong>Retomar conversa anterior</strong><small>Continuar exatamente de onde você parou</small></button>` : ""}
                        <button class="ai-option-btn" data-context="ensino"><strong>Ensino humanitário</strong><small>Planejar aula, atividade ou material sem uso de animais</small></button>
                        <button class="ai-option-btn" data-context="pesquisa"><strong>Pesquisa · substituição 1R</strong><small>Mapear alternativas ao modelo animal e montar um plano de transição</small></button>
                        <button class="ai-option-btn" data-context="biomedica"><strong>Biomedicina, Farmácia e áreas afins</strong><small>Comparar in vitro, organoides, organ-on-chip, in silico e outras NAMs</small></button>
                        <button class="ai-option-btn" data-context="legislacao"><strong>Legislação, bases e validação</strong><small>Localizar marcos, bases oficiais e status regulatório</small></button>
                    </div>
                    <p style="max-width:520px; margin:1rem 0 0; color:#687078; font-size:.84rem; line-height:1.5;">A ECO prioriza substituição, diferencia método validado de método experimental e sinaliza quando um dado precisa ser confirmado em fonte oficial.</p>
                </div>

                <div id="message-container" style="flex:1; overflow-y:auto; padding:2rem 2.5rem; display:none; flex-direction:column; gap:1rem;"></div>

                <div id="chat-input-row" style="background:white; padding:1rem 1.25rem; display:none; align-items:center; gap:.8rem; border-top:1px solid #eee;">
                    <div style="flex:1; background:#F4F7F9; border-radius:24px; display:flex; align-items:center; padding:0 1rem;">
                        <textarea id="user-input" rows="1" maxlength="${aiConfig.maxChars}" placeholder="Descreva sua aula, pesquisa, técnica ou dúvida..." style="flex:1; border:none; background:none; padding:1rem 0; outline:none; font:inherit; color:#333; resize:none; max-height:130px;"></textarea>
                    </div>
                    <button id="send-msg" aria-label="Enviar mensagem" style="background:#2C2C33; color:white; border:none; width:52px; height:52px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="send" style="width:22px;"></i>
                    </button>
                </div>
            </div>

            <style>
                .ai-option-btn{background:white;border:2px solid #e7e8e8;padding:1.1rem 1.25rem;border-radius:18px;cursor:pointer;transition:.2s;font-weight:700;color:#2C2C33;text-align:left;box-shadow:0 4px 8px rgba(0,0,0,.025);display:flex;flex-direction:column;gap:.35rem}.ai-option-btn small{font-weight:500;color:#697177;line-height:1.35}.ai-option-btn:hover,.ai-option-btn:focus-visible{border-color:#FACD5F;background:#fffaf0;transform:translateY(-2px);outline:none}.ai-resume-btn{border-color:#7dcfc4;background:#f3fffc}.msg-bubble{max-width:86%;padding:1rem 1.2rem;border-radius:20px;line-height:1.6;font-size:.96rem;position:relative;animation:fadeIn .2s ease;overflow-wrap:anywhere}.msg-ai{background:white;color:#333;margin-right:auto;border-bottom-left-radius:5px;box-shadow:0 4px 14px rgba(0,0,0,.05)}.msg-user{background:#FACD5F;color:#2C2C33;margin-left:auto;border-bottom-right-radius:5px}.msg-meta{font-size:.72rem;opacity:.62;margin-top:.5rem}.typing-dots{display:inline-flex;gap:4px}.typing-dots span{width:6px;height:6px;border-radius:50%;background:#7b858b;animation:ecoPulse 1s infinite alternate}.typing-dots span:nth-child(2){animation-delay:.2s}.typing-dots span:nth-child(3){animation-delay:.4s}@keyframes ecoPulse{to{opacity:.25;transform:translateY(-2px)}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}#message-container::-webkit-scrollbar{width:6px}#message-container::-webkit-scrollbar-thumb{background:#ddd;border-radius:10px}@media(max-width:768px){.chat-wrapper{width:100%!important;max-width:100%!important;height:88vh!important;min-height:0!important;border-radius:0!important}.msg-bubble{max-width:92%}#message-container{padding:1.25rem!important}.chat-header{padding:1rem!important}}
            </style>
        `;

        const selector = container.querySelector("#interaction-selector");
        const msgGrid = container.querySelector("#message-container");
        const inputRow = container.querySelector("#chat-input-row");
        const backBtn = container.querySelector("#chat-back");
        const clearBtn = container.querySelector("#clear-chat");
        const sendBtn = container.querySelector("#send-msg");
        const inputField = container.querySelector("#user-input");
        const statusEl = container.querySelector("#ai-status");

        let currentMode = persistentSession.mode || null;
        let conversationId = persistentSession.conversationId || null;
        let sending = false;

        const setChatVisible = (visible) => {
            selector.style.display = visible ? "none" : "flex";
            msgGrid.style.display = visible ? "flex" : "none";
            inputRow.style.display = visible ? "flex" : "none";
        };

        function addMessage(sender, text, options = {}) {
            const msgDiv = document.createElement("div");
            msgDiv.className = `msg-bubble msg-${sender}`;
            if (options.id) msgDiv.id = options.id;

            if (options.loading) {
                msgDiv.innerHTML = `<span class="typing-dots" aria-label="ECO está elaborando"><span></span><span></span><span></span></span>`;
            } else {
                msgDiv.innerHTML = `${formatSafeMessage(text)}${options.persisted ? '<div class="msg-meta">salvo no AlterECO</div>' : ""}`;
            }

            msgGrid.appendChild(msgDiv);
            msgGrid.scrollTop = msgGrid.scrollHeight;
        }

        async function openConversation(mode, resume = false) {
            statusEl.textContent = `${aiConfig.modelLabel} · conectando...`;
            setChatVisible(true);
            msgGrid.innerHTML = "";

            try {
                let data;
                if (resume && conversationId) {
                    data = await invokeAIEdge({
                        action: "history",
                        conversationId,
                        visitorToken: persistentSession.visitorToken
                    });
                } else {
                    data = await invokeAIEdge({
                        action: "start",
                        mode,
                        visitorToken: persistentSession.visitorToken
                    });
                    conversationId = data.conversationId;
                    currentMode = mode;
                    persistentSession.conversationId = conversationId;
                    persistentSession.mode = mode;
                    saveAISession(persistentSession);
                }

                const messages = data.messages || [];
                messages.forEach((message) => {
                    addMessage(message.role === "assistant" ? "ai" : "user", message.content, { persisted: true });
                });

                if (!messages.length && data.greeting) {
                    addMessage("ai", data.greeting, { persisted: true });
                }

                currentMode = data.mode || currentMode || mode;
                statusEl.textContent = `${aiConfig.modelLabel} · conversa persistida`;
                inputField.focus();
            } catch (error) {
                console.error("Erro ao abrir ECO IA:", error);
                statusEl.textContent = "ECO · indisponível no momento";
                addMessage("ai", `Não consegui abrir a conversa. ${error.message}`);
            }
        }

        async function clearConversation() {
            if (!conversationId) {
                msgGrid.innerHTML = "";
                setChatVisible(false);
                return;
            }

            if (!confirm("Apagar esta conversa do AlterECO?")) return;

            clearBtn.disabled = true;
            try {
                await invokeAIEdge({
                    action: "delete",
                    conversationId,
                    visitorToken: persistentSession.visitorToken
                });
            } catch (error) {
                console.error(error);
                alert(`Não foi possível apagar a conversa.\n\n${error.message}`);
                return;
            } finally {
                clearBtn.disabled = false;
            }

            conversationId = null;
            currentMode = null;
            persistentSession.conversationId = null;
            persistentSession.mode = null;
            saveAISession(persistentSession);
            msgGrid.innerHTML = "";
            setChatVisible(false);
        }

        async function sendMessage() {
            const text = inputField.value.trim();
            if (!text || sending) return;
            if (!conversationId) {
                alert("Escolha primeiro o tipo de apoio da ECO.");
                return;
            }

            sending = true;
            sendBtn.disabled = true;
            addMessage("user", text);
            inputField.value = "";
            inputField.style.height = "auto";

            const loadingId = `eco-loading-${Date.now()}`;
            addMessage("ai", "", { id: loadingId, loading: true });
            statusEl.textContent = `${aiConfig.modelLabel} · analisando...`;

            try {
                const data = await invokeAIEdge({
                    action: "message",
                    message: text,
                    mode: currentMode,
                    conversationId,
                    visitorToken: persistentSession.visitorToken
                });

                document.getElementById(loadingId)?.remove();
                addMessage("ai", data.response, { persisted: true });
                statusEl.textContent = `${data.model || aiConfig.modelLabel} · conversa persistida`;
            } catch (error) {
                document.getElementById(loadingId)?.remove();
                console.error("Erro da ECO IA:", error);
                addMessage("ai", `Não consegui responder agora. ${error.message}`);
                statusEl.textContent = "ECO · tente novamente";
            } finally {
                sending = false;
                sendBtn.disabled = false;
                inputField.focus();
            }
        }

        backBtn.onclick = () => {
            window.location.hash = "home";
            if (window.renderPage) window.renderPage("home");
        };
        clearBtn.onclick = clearConversation;
        sendBtn.onclick = sendMessage;

        inputField.addEventListener("input", () => {
            inputField.style.height = "auto";
            inputField.style.height = `${Math.min(inputField.scrollHeight, 130)}px`;
        });
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });

        container.querySelectorAll(".ai-option-btn").forEach((btn) => {
            btn.onclick = () => {
                const mode = btn.dataset.context;
                if (mode === "resume") {
                    openConversation(persistentSession.mode || "pesquisa", true);
                } else {
                    openConversation(mode, false);
                }
            };
        });

        if (window.lucide) window.lucide.createIcons();
    }

    window.initAIECOInterface = initAIECOInterface;
})();
