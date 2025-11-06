// src/middleware/auth.js
import supabaseAdmin from "../lib/supabaseAdmin.js";
import prisma from "../lib/prismaClient.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Verifica o token via Supabase (admin)
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      console.error("❌ Erro Supabase:", error?.message || "Usuário inválido");
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    const supUser = data.user;
    const userId = supUser.id;

    // Busca o perfil local no Prisma
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        matricula: true,
        profilePic: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
    });

    req.user = {
      id: userId,
      email: supUser.email,
      name: profile?.name ?? null,
      matricula: profile?.matricula ?? null,
      profilePic: profile?.profilePic ?? null,
      isAdmin: !!profile?.isAdmin,
      isSuperAdmin: !!profile?.isSuperAdmin,
    };

    next();
  } catch (err) {
    console.error("🔥 authenticateToken error:", err);
    res.status(500).json({ error: "Erro interno de autenticação" });
  }
}
