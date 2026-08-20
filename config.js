// AlterECO — configuração pública do frontend.
//
// IMPORTANTE:
// - Este arquivo pode ficar no GitHub e no navegador.
// - NUNCA coloque aqui Gemini API Key, service_role ou sb_secret.
// - A Gemini API é chamada somente pela Edge Function do Supabase.
const CONFIG = {
    AI: {
        FUNCTION_NAME: "ai-eco",
        CURATOR_FUNCTION_NAME: "ai-curator",
        MODEL_LABEL: "Gemini 3.5 Flash",
        MAX_MESSAGE_CHARS: 3000
    },

    COLORS: {
        PRIMARY: "#FACD5F",
        SECONDARY: "#40F8E2",
        DARK: "#2C2C33",
        LIGHT: "#F2F2F2",
        AI_MOSS: "#4D6A57",
        AI_CREAM: "#F6F3EA",
        AI_PETROL: "#315B63"
    }
};
