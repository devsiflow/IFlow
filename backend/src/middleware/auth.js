import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Tenta verificar com a secret padrão, se falhar tenta com a service role key
    let decoded;
    const tryVerify = (secret) =>
      new Promise((resolve, reject) => {
        if (!secret) return reject(new Error("no-secret"));
        jwt.verify(token, secret, { algorithms: ["HS256"] }, (err, payload) => {
          if (err) return reject(err);
          resolve(payload);
        });
      });

    try {
      decoded = await tryVerify(process.env.SUPABASE_JWT_SECRET);
    } catch (err1) {
      try {
        decoded = await tryVerify(process.env.SUPABASE_SERVICE_ROLE_KEY);
      } catch (err2) {
        console.error(
          "JWT verify failed (both secrets):",
          err1.message,
          err2?.message
        );
        return res.status(403).json({ error: "Token inválido ou expirado" });
      }
    }

    // Para diagnóstico, log curto (remover em produção)
    console.debug("auth: decoded token:", {
      sub: decoded.sub,
      user_id: decoded.user_id,
      role: decoded.role,
    });

    // Aceita diferentes claims que contenham o id do usuário
    const userId = decoded.sub || decoded.user_id || decoded?.aud || null;
    if (!userId) {
      console.error("auth: não foi possível extrair user id do token", decoded);
      return res
        .status(403)
        .json({ error: "Token inválido: user id não encontrado" });
    }

    // Busca o profile no banco para obter isAdmin / isSuperAdmin
    const profile = await prisma.profile.findUnique({
      where: { id: String(userId) },
      select: { id: true, email: true, isAdmin: true, isSuperAdmin: true },
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
