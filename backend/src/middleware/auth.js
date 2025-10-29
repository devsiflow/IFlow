import supabase from "../lib/supabaseClient.js";
import prisma from "../lib/prismaClient.js";

/**
 * authenticateToken
 * Espera header: Authorization: Bearer <token>
 * Verifica token no Supabase e busca o profile no Prisma para popular req.user
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Pega o usuário no Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.error("Supabase auth error:", error);
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    const supUser = data.user;
    const userId = supUser.id;

    // Busca o profile no Prisma para obter isAdmin / isSuperAdmin
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true, name: true, matricula: true, profilePic: true, isAdmin: true, isSuperAdmin: true }
    });

    // Preenche req.user com informações úteis
    req.user = {
      id: userId,
      email: supUser.email ?? null,
      name: profile?.name ?? null,
      matricula: profile?.matricula ?? null,
      profilePic: profile?.profilePic ?? null,
      isAdmin: profile?.isAdmin ?? false,
      isSuperAdmin: profile?.isSuperAdmin ?? false
    };

    next();
  } catch (err) {
    console.error("authenticateToken error:", err);
    return res.status(500).json({ error: "Erro no middleware de autenticação" });
  }
}
