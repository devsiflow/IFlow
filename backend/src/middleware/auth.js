import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Verifica exclusivamente com o JWT Secret REAL do Supabase
    const decoded = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    console.debug("auth: decoded token:", {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    });

    const userId = decoded.sub || decoded.user_id;
    if (!userId) {
      console.error("auth: user id não encontrado no token:", decoded);
      return res.status(403).json({ error: "Token inválido: user id ausente" });
    }

    // Busca permissões do usuário no banco
    const profile = await prisma.profile.findUnique({
      where: { id: String(userId) },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
    });

    req.user = {
      id: userId,
      email: decoded.email || profile?.email || null,
      role: decoded.role || null,
      isAdmin: profile?.isAdmin ?? false,
      isSuperAdmin: profile?.isSuperAdmin ?? false,
    };

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export function onlyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const isAdminFlag =
    req.user.isAdmin === true || req.user.isSuperAdmin === true;

  const roleAllow =
    req.user.role &&
    ["admin", "superadmin"].includes(req.user.role.toLowerCase());

  if (!isAdminFlag && !roleAllow) {
    return res
      .status(403)
      .json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
