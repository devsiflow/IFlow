import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";

function parseCookieToken(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith("sb-access-token="))
      return decodeURIComponent(part.split("=")[1]);
    if (part.startsWith("access_token="))
      return decodeURIComponent(part.split("=")[1]);
  }
  return null;
}

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    // Try common locations for token: Authorization header, cookie, query, body
    let token = null;

    if (authHeader) {
      // Accept both "Bearer <token>" and raw token in header
      const parts = authHeader.split(" ").filter(Boolean);
      token = parts.length > 1 ? parts[1] : parts[0];
    }

    if (!token) token = parseCookieToken(req.headers["cookie"]);
    if (!token && req.query && req.query.access_token)
      token = req.query.access_token;
    if (!token && req.body && req.body.access_token)
      token = req.body.access_token;

    if (!token) {
      console.warn(
        "auth: token not provided (no Authorization header, cookie or access_token)"
      );
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // For safety, log only a prefix of the token
    console.debug("auth: received token prefix:", token.slice(0, 12));

    // Helper to verify with a given secret
    const tryVerify = (secret) =>
      new Promise((resolve, reject) => {
        if (!secret) return reject(new Error("no-secret"));
        jwt.verify(token, secret, { algorithms: ["HS256"] }, (err, payload) => {
          if (err) return reject(err);
          resolve(payload);
        });
      });

    let decoded;
    // First try with JWT secret (typical Supabase JWT secret)
    try {
      decoded = await tryVerify(process.env.SUPABASE_JWT_SECRET);
    } catch (err1) {
      // If that fails, try service role key as a last resort (some env setups store jwt secret there)
      try {
        decoded = await tryVerify(process.env.SUPABASE_SERVICE_ROLE_KEY);
      } catch (err2) {
        console.error(
          "JWT verify failed (both secrets):",
          err1?.message,
          err2?.message
        );
        return res.status(403).json({ error: "Token inválido ou expirado" });
      }
    }

    console.debug("auth: decoded token (partial):", {
      sub: decoded?.sub,
      user_id: decoded?.user_id,
      role: decoded?.role,
      email: decoded?.email,
    });

    const userId = decoded?.sub || decoded?.user_id || decoded?.aud || null;
    if (!userId) {
      console.error("auth: não foi possível extrair user id do token", decoded);
      return res
        .status(403)
        .json({ error: "Token inválido: user id não encontrado" });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: String(userId) },
      select: { id: true, email: true, isAdmin: true, isSuperAdmin: true },
    });

    req.user = {
      id: String(userId),
      email: decoded?.email || profile?.email || null,
      role: decoded?.role || null,
      isAdmin: profile?.isAdmin ?? false,
      isSuperAdmin: profile?.isSuperAdmin ?? false,
    };

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err?.message || err);
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export function onlyAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Usuário não autenticado" });

  const isAdminFlag = req.user.isAdmin === true || req.user.isSuperAdmin === true;
  const roleAllow = req.user.role && ["admin", "superadmin"].includes(String(req.user.role).toLowerCase());

  if (!isAdminFlag && !roleAllow) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
