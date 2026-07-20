/**
 * AI AlterECO - Real Generative AI Assistant Integration
 */

async function initAIECOInterface(container) {
    const apiKey = CONFIG.GEMINI_API_KEY;
    const systemPrompt = CONFIG.AI_ECO_PROMPT;

    container.innerHTML = `
        <div class="chat-wrapper" style="max-width: 600px; margin: 0 auto; background: #F4F7F9; height: 80vh; display: flex; flex-direction: column; border-radius: 30px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid #eee;">
            <!-- Header -->
            <div class="chat-header" style="background: white; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #eee;">
                <button id="chat-back" style="background:none; border:none; cursor:pointer;"><i data-lucide="arrow-left" style="color:#777;"></i></button>
                <div style="width: 45px; height: 45px; border-radius: 50%; overflow:hidden;">
                    <img src="assets/eco.png" alt="ECO" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="flex:1;">
                    <h3 style="margin:0; font-size:1.1rem; color:#333;">Assistente IA AlterECO</h3>
                    <span style="font-size:0.8rem; color:#4DB6AC;">Online agora</span>
                </div>
                <button id="clear-chat" title="Limpar conversa" style="background:none; border:none; color:#ccc; cursor:pointer;"><i data-lucide="trash-2" style="width:20px;"></i></button>
            </div>

            <!-- Pre-chat Selection -->
            <div id="interaction-selector" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; flex: 1; align-items: center; justify-content: center; text-align: center;">
                <h4 style="color:var(--primary-navy); margin-bottom:1.5rem; font-size:1.2rem;">O que você deseja planejar hoje?</h4>
                <div style="display:grid; grid-template-columns: 1fr; gap: 1.2rem; width: 100%; max-width: 400px;">
                    <button class="ai-option-btn" data-context="ensino">Planejar Aula de Ensino Básico</button>
                    <button class="ai-option-btn" data-context="pesquisa">Protocolo de Pesquisa Superior</button>
                    <button class="ai-option-btn" data-context="biomedica">Substituição na FILTRO (Biomedicina, Farmácia, Estética, Outras areas relacionadas)</button>
                </div>
            </div>

            <!-- Message Stream -->
            <div id="message-container" style="flex: 1; overflow-y: auto; padding: 2.5rem; display: none; flex-direction: column; gap: 2rem;">
            </div>

            <!-- Input Area -->
            <div id="chat-input-row" style="background: white; padding: 1.5rem; display: none; align-items: center; gap: 1rem; border-top: 1px solid #eee;">
                <div style="flex:1; background: #F4F7F9; border-radius: 30px; display: flex; align-items: center; padding: 0 1.5rem;">
                    <input type="text" id="user-input" placeholder="Digite sua mensagem..." style="flex:1; border:none; background:none; padding: 1.2rem 0; outline:none; font-size:1rem; color:#333;">
                </div>
                <button id="send-msg" style="background:#2C2C33; color:white; border:none; width:55px; height:55px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.3s;">
                    <i data-lucide="send" style="width:24px;"></i>
                </button>
            </div>
        </div>

        <style>
            .ai-option-btn {
                background: white; border: 2px solid #eee; padding: 1.5rem; border-radius: 20px; 
                cursor: pointer; transition: all 0.3s; font-weight: 700; color: #2C2C33;
                text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            }
            .ai-option-btn:hover { border-color: # FACD5F; background: #FACD5F; transform: translateY(-3px); }
            
            .msg-bubble { max-width: 85%; padding: 1.5rem; border-radius: 25px; line-height: 1.6; font-size: 0.95rem; position: relative; animation: fadeIn 0.3s ease; }
            .msg-ai { background: white; color: #333; margin-right: auto; border-bottom-left-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
            .msg-user { background: #FACD5F; color: #2C2C33; margin-left: auto; border-bottom-right-radius: 5px; }
            
            @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
            
            .avatar-icon { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; bottom: 0; }
            .ai-avatar { left: -45px; background: #FACD5F; color: #2C2C33; }
            .user-avatar { right: -45px; background: #2C2C33; color: white; }
            
            #message-container::-webkit-scrollbar { width: 6px; }
            #message-container::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
            
            @media (max-width: 768px) {
                .chat-wrapper { width: 100% !important; max-width: 100% !important; height: 90vh !important; border-radius: 0 !important; }
                .msg-bubble { max-width: 90%; padding: 1.2rem; }
                .ai-avatar, .user-avatar { display: none; }
                .chat-header { padding: 1rem; }
            }
        </style>
    `;

    const selector = document.getElementById('interaction-selector');
    const msgGrid = document.getElementById('message-container');
    const inputRow = document.getElementById('chat-input-row');
    const backBtn = document.getElementById('chat-back');
    const clearBtn = document.getElementById('clear-chat');
    const sendBtn = document.getElementById('send-msg');
    const inputField = document.getElementById('user-input');

    let chatHistory = [];

    backBtn.onclick = () => window.location.hash = 'home';
    clearBtn.onclick = () => { msgGrid.innerHTML = ''; chatHistory = []; selector.style.display = 'flex'; msgGrid.style.display = 'none'; inputRow.style.display = 'none'; };

    document.querySelectorAll('.ai-option-btn').forEach(btn => {
        btn.onclick = () => {
            const context = btn.dataset.context;
            selector.style.display = 'none';
            msgGrid.style.display = 'flex';
            inputRow.style.display = 'flex';

            let greeting = "Olá! Vamos planejar sua aula de ensino humanitário focada em conscientização pública?";
            if (context === 'pesquisa') greeting = "Preparei meu conhecimento técnico sobre Métodos Substitutivos (3Rs) na pesquisa acadêmica. Como posso orientar seu protocolo científico hoje?";
            if (context === 'biomedica') greeting = "A biomedicina moderna avança rapidamente com modelos in vitro e Organ-on-a-Chip. O que você deseja transitar de modelo animal para digital?";

            addMessage('ai', greeting);
        };
    });

    async function callGemini(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const contents = [
             { role: 'user', parts: [{ text: "INSTRUÇÕES: " + systemPrompt }] },
             { role: 'model', parts: [{ text: "Entendido. Sou a IA ECO e vou te ajudar com dados éticos e substitutivos." }] },
             { role: 'user', parts: [{ text: prompt }] }
        ];

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });
            const data = await response.json();
            
            if (!response.ok || data.error) {
                console.error("Gemini API Error:", data.error || data);
                return "❌ Erro da IA: " + (data.error ? data.error.message : "Falha na resposta.");
            }
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                return "❌ Resposta vazia da IA. Tente reformular a pergunta.";
            }

            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            console.error("Network AI Error:", err);
            return "❌ Falha de conexão. Verifique sua rede.";
        }
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage('user', text);
        inputField.value = '';
        inputField.focus();

        const loadingId = 'loading-' + Date.now();
        addMessage('ai', `<div style="display:flex; gap:5px;"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>`, loadingId);

        const aiResponse = await callGemini(text);

        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        addMessage('ai', aiResponse);
    }

    function addMessage(sender, text, id) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg-bubble msg-${sender}`;
        if (id) msgDiv.id = id;
        msgDiv.style.marginBottom = '2.5rem';

        const avatarClass = sender === 'ai' ? 'ai-avatar' : 'user-avatar';
        const icon = sender === 'ai' ? 'bot' : 'user';

        // Format code/markdown-ish breaks
        const formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        msgDiv.innerHTML = `
             ${formattedText}
            <div class="avatar-icon ${avatarClass}">
                ${sender === 'ai' ? `<img src="assets/eco.png" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">` : `<i data-lucide="${icon}" style="width:18px;"></i>`}
            </div>
        `;
        msgGrid.appendChild(msgDiv);
        msgGrid.scrollTop = msgGrid.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
    }

    sendBtn.onclick = sendMessage;
    inputField.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
    if (window.lucide) window.lucide.createIcons();
}

window.initAIECOInterface = initAIECOInterface;
