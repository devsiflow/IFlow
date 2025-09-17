// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Pega as variáveis do .env do Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação básica para evitar erro de URL faltando
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL ou ANON KEY não encontrada. Verifique seu arquivo .env no frontend!"
  );
}

// Cria e exporta o client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
