// backend/src/lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// ⚙️ Lê variáveis do ambiente (Render ou .env local)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🚨 Falha explícita se estiver faltando variável
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "❌ Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes no backend (.env ou Render env vars)"
  );
}

// ✅ Client administrativo do Supabase (Service Key)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default supabaseAdmin;
