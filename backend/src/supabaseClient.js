// src/supabaseClient.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // garante que o .env foi carregado

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase URL ou SERVICE_ROLE_KEY não encontrada.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
