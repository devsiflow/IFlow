// middleware/auth.js
import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";
import supabaseAdmin from "../lib/supabaseAdmin.js";

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
      include: { campus: true },
    });

    // Se não existir → cria com dados do Supabase
    if (!profile) {
      console.log("🆕 Criando profile automaticamente para:", userId);

      const userMetadata = supaUser?.user_metadata || {};
      const email = supaUser?.email || decoded.email;

      // Dados padrão se não tiver metadata
      const userName =
        userMetadata.name || userMetadata.nome || email || "Usuário";
      const userMatricula =
        userMetadata.matricula || `user_${userId.slice(0, 8)}`;
      const userCampusId = userMetadata.campusId
        ? parseInt(userMetadata.campusId)
        : null;

      try {
        profile = await prisma.profile.create({
          data: {
            id: userId,
            name: userName,
            matricula: userMatricula,
            campusId: userCampusId,
            profilePic: null,
          },
          include: { campus: true },
        });
        console.log("✅ Profile criado automaticamente");
      } catch (createError) {
        console.error("❌ Erro ao criar profile:", createError);

        // Se for erro de duplicação (concorrência), busca novamente
        if (createError.code === "P2002") {
          profile = await prisma.profile.findUnique({
            where: { id: userId },
            include: { campus: true },
          });
        } else {
          throw createError;
        }
      }
    }

    if (!profile) {
      return res.status(404).json({
        error: "Usuário não encontrado e não pôde ser criado",
      });
    }

    // 🔥 ADICIONAR CAMPUS ID AO REQ.USER
 req.user = {
      id: profile.id,
      email: decoded.email || supaUser?.email || null,
      name: profile.name,
      matricula: profile.matricula,
      profilePic: profile.profilePic,
      isAdmin: profile.isAdmin,
      isSuperAdmin: profile.isSuperAdmin,
      campusId: profile.campusId,
      campus: profile.campus
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
