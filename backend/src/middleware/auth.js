import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // Busca o profile no banco para obter isAdmin / isSuperAdmin
    const profile = await prisma.profile.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, isAdmin: true, isSuperAdmin: true },
    });

    req.user = {
      id: decoded.sub,
      email: decoded.email || profile?.email || null,
      role: decoded.role || null,
      isAdmin: profile?.isAdmin ?? false,
      isSuperAdmin: profile?.isSuperAdmin ?? false,
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

  // Permite se flags do profile indicarem admin, ou se role do token for 'admin'/'superadmin'
  const isAdminFlag =
    req.user.isAdmin === true || req.user.isSuperAdmin === true;
  const roleAllow =
    req.user.role &&
    ["admin", "superadmin"].includes(String(req.user.role).toLowerCase());

  if (!isAdminFlag && !roleAllow) {
    return res
      .status(403)
      .json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
