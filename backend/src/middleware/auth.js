import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";
import supabaseAdmin from "../lib/supabaseAdmin.js";

/**
 * Middleware de autenticação que aceita:
 * 1) Tokens assinados pelo SUPABASE_JWT_SECRET (jwt.verify)
 * 2) Tokens de acesso do Supabase (verificados via supabaseAdmin.auth.getUser)
 *
 * Ao final, anexa req.user com: { id, email, role, isAdmin, isSuperAdmin, ... }
 */

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  let supaUser = null;
  let decoded = null;

  // 1) Tenta verificar com o SUPABASE_JWT_SECRET (caso exista)
  if (process.env.SUPABASE_JWT_SECRET) {
    try {
      decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    } catch (err) {
      decoded = null;
    }
  }

  // 2) Se não conseguiu com o JWT_SECRET, tenta o Supabase Admin
  if (!decoded) {
    try {
      const result = await supabaseAdmin.auth.getUser(token).catch((e) => ({ error: e }));

      if (result && result.data && result.data.user) {
        supaUser = result.data.user;

        decoded = {
          sub: supaUser.id,
          email: supaUser.email,
        };
      } else if (result && result.error) {
        console.warn("Supabase auth.getUser error:", result.error);
      }
    } catch (err) {
      console.warn("Erro verificando token no Supabase Admin:", err?.message || err);
    }
  }

  // Se ainda não conseguiu decodificar o token
  if (!decoded) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }

  try {
    const userId =
      decoded.sub || decoded.id || decoded.user_id || decoded.uid;

    if (!userId) {
      return res.status(403).json({ error: "Token sem identificador de usuário (sub)" });
    }

    let profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        matricula: true,
        profilePic: true,
        isAdmin: true,
        isSuperAdmin: true,
        role: true,
      },
    });

    // Caso o usuário exista no Supabase mas não exista no banco local → cria automaticamente
    if (!profile && supaUser) {
      profile = await prisma.profile.create({
        data: {
          id: userId,
          name:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.name ||
            supaUser.email ||
            "Usuário Supabase",
          email: supaUser.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          matricula: true,
          profilePic: true,
          isAdmin: true,
          isSuperAdmin: true,
          role: true,
        },
      });
    }

    // Se ainda assim não houver profile
    if (!profile) {
      req.user = {
        id: userId,
        email: decoded.email || null,
        isAdmin: false,
        isSuperAdmin: false,
        role: null,
      };
      return next();
    }

    req.user = profile;

    next();
  } catch (err) {
    console.error("Erro no authenticateToken:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function requireAdmin(req, res, next) {
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
