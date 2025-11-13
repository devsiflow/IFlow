import jwt from "jsonwebtoken";

/**
 * Middleware para autenticação via token JWT
 * Verifica o token enviado no header "Authorization"
 * e adiciona o usuário decodificado em req.user
 */
export function authenticateToken(req, res, next) {
  // Pega o token do header "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Verifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Armazena os dados do usuário no request
    req.user = decoded;

    // Continua para a próxima função/rota
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

/**
 * Middleware opcional para permitir apenas administradores
 * (caso queira proteger rotas específicas no futuro)
 */
export function onlyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (!req.user.isAdmin && !req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
