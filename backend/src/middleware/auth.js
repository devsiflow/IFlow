import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";
import supabaseAdmin from "../lib/supabaseAdmin.js";

/**
 * Autenticação compatível com:
 *  - JWT do Supabase
 *  - Access Token padrão (supabase.auth)
 *
 * E GARANTE:
 *  - Cria usuário no Prisma caso não exista
 *  - Não quebra quando o ID é UUID (Supabase)
 */

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  let decoded = null;
  let supaUser = null;

  // Tenta verificar pelo JWT_SECRET (antigo)
  if (process.env.SUPABASE_JWT_SECRET) {
    try {
      decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    } catch (e) {
      decoded = null;
    }
  }

  // Caso não decodifique → tenta login normal do Supabase
  if (!decoded) {
    try {
      const result = await supabaseAdmin.auth.getUser(token);

      if (result?.data?.user) {
        supaUser = result.data.user;

        decoded = {
          sub: supaUser.id,
          email: supaUser.email,
        };
      }
    } catch (err) {
      console.log("Erro supabaseAdmin:", err);
    }
  }

  if (!decoded) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }

  try {
    const userId =
      decoded.sub || decoded.id || decoded.user_id || decoded.uid;

    if (!userId)
      return res.status(403).json({ error: "Token sem ID (sub) inválido" });

    // 🔥 CORREÇÃO: busca por Supabase ID (UUID)
    let profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    // 🔥 CORREÇÃO IMPORTANTE:
    // Se não existir, cria SEM FORÇAR ID PRISMA
    if (!profile && supaUser) {
      profile = await prisma.profile.create({
        data: {
          id: userId, // agora UUID é aceito no schema
          email: supaUser.email,
          name:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.name ||
            supaUser.email,
        },
      });
    }

    // Se mesmo assim não existir
    if (!profile) {
      return res.status(404).json({
        error: "Usuário não encontrado e não pôde ser criado",
      });
    }

    req.user = profile;

    next();
  } catch (err) {
    console.error("🔥 ERRO authenticateToken:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function requireAdmin(req, res, next) {
  if (!req.user)
    return res.status(401).json({ error: "Usuário não autenticado" });

  const isAdminFlag =
    req.user.isAdmin === true || req.user.isSuperAdmin === true;

  const roleAllow =
    req.user.role &&
    ["admin", "superadmin"].includes(req.user.role.toLowerCase());

  if (!isAdminFlag && !roleAllow)
    return res
      .status(403)
      .json({ error: "Apenas administradores podem acessar" });

  next();
}
