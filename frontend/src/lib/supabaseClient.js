// src/lib/supabaseClient.js (FRONTEND)
import { createClient } from "@supabase/supabase-js";

// Variáveis do Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL ou ANON KEY não encontrada. Verifique seu arquivo .env no frontend!"
  );
}

// Ativa persistSession + autoRefreshToken pra renovar access_token automaticamente
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
