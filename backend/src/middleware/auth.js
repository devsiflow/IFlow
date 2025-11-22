import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";
import supabaseAdmin from "../lib/supabaseAdmin.js";

/**
 * Autenticação compatível com:
 *  - JWT do Supabase
 *  - Access Token padrão (supabase.auth)
 *
 * Garante:
 *  - Usuário com UUID (Supabase) funciona
 *  - Profile é criado automaticamente
 *  - CampusId SEMPRE vem no req.user
 */

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  let decoded = null;
  let supaUser = null;

  // Tenta verificar com JWT_SECRET
  if (process.env.SUPABASE_JWT_SECRET) {
    try {
      decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    } catch {
      decoded = null;
    }
  }

  // Se não conseguiu decodificar → tenta via Supabase
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
    const userId = decoded.sub || decoded.id;

    if (!userId)
      return res.status(403).json({ error: "Token sem ID (sub) inválido" });

    // Busca o profile INCLUINDO campus
    let profile = await prisma.profile.findUnique({
      where: { id: userId },
      include: { campus: true }, // 🔥 INCLUIR CAMPUS AQUI
    });

    // Se não existir → cria
    if (!profile && supaUser) {
      profile = await prisma.profile.create({
        data: {
          id: userId,
          email: supaUser.email,
          name:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.name ||
            supaUser.email,
          campusId: supaUser.user_metadata?.campusId || null,
        },
        include: { campus: true }, // 🔥 INCLUIR CAMPUS AQUI TAMBÉM
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: "Usuário não encontrado e não pôde ser criado",
      });
    }

    // 🔥 ADICIONAR CAMPUS ID AO REQ.USER
    req.user = {
      ...profile,
      campusId: profile.campusId // Garantir que campusId está disponível
    };
    
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