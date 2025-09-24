import supabase  from "../lib/supabaseClient.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(403).json({ error: "Token inválido ou expirado" });

  req.user = user; // UUID do Supabase
  next();
}
