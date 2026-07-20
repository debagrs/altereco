/**
 * ============================================================
 * ALTERECO - SUPABASE CONFIG
 * ============================================================
 * ESTE É O ÚNICO ARQUIVO DO FRONTEND QUE CONHECE O SUPABASE.
 *
 * NUNCA coloque aqui:
 * - sb_secret
 * - service_role
 * - Gemini API Key
 * ============================================================
 */

(function () {
    "use strict";

    const SUPABASE_URL = "https://plzywjjrezuzmzskjgly.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XmZjne98-8RsObNrab3-Qw_aAgwtJmW";

    if (!SUPABASE_PUBLISHABLE_KEY) {
        console.error("Publishable Key não configurada.");
        return;
    }

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {
        console.error("Biblioteca do Supabase não foi carregada.");
        return;
    }

    window.alterecoSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: "altereco-auth-session"
            }
        }
    );

    console.log("✅ AlterECO conectado ao Supabase.");
})();
