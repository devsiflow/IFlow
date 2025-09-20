import jwt from "jsonwebtoken";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // O Supabase já usa JWT assinado com a chave do projeto
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // O ID do usuário do Supabase vem em "sub"
    req.user = { id: decoded.sub };

    next();
  } catch (err) {
    console.error("Erro ao validar token Supabase:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
}
