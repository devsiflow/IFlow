import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // ✔ Usa o segredo do Supabase
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // ✔ O ID do usuário fica em `sub`
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export function onlyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (!req.user.isAdmin && !req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
