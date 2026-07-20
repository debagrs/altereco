/**
 * AlterECO — conexão pública com o Supabase
 *
 * Este arquivo fica no frontend e deve conter somente:
 * - URL pública do projeto;
 * - chave publicável do Supabase.
 *
 * Nunca colocar aqui:
 * - senha;
 * - secret key;
 * - service_role;
 * - chave Gemini;
 * - qualquer chave administrativa.
 */

(function initializeAlterEcoSupabase() {
    'use strict';

    const SUPABASE_URL =
        'https://plzywjjrezuzmzskjgly.supabase.co';

    const SUPABASE_PUBLISHABLE_KEY =
        'sb_publishable_XmZjne98-8RsObNrab3-Qw_aAgwtJmW';

    const hasValidKey =
        SUPABASE_PUBLISHABLE_KEY &&
        !SUPABASE_PUBLISHABLE_KEY.includes('sb_publishable_XmZjne98-8RsObNrab3-Qw_aAgwtJmW');

    if (!hasValidKey) {
        console.error(
            'AlterECO: a chave pública do Supabase ainda não foi configurada.'
        );

        window.alterecoSupabase = null;
        return;
    }

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== 'function'
    ) {
        console.error(
            'AlterECO: a biblioteca oficial do Supabase não foi carregada.'
        );

        window.alterecoSupabase = null;
        return;
    }

    try {
        window.alterecoSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true,
                        storageKey: 'altereco-auth-session'
                    }
                }
            );

        console.info(
            'AlterECO: conexão segura com o Supabase preparada.'
        );
    } catch (error) {
        console.error(
            'AlterECO: não foi possível iniciar o Supabase.',
            error
        );

        window.alterecoSupabase = null;
    }
})();
