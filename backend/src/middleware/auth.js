import supabase from "../lib/supabaseClient.js";
import prisma from "../lib/prismaClient.js";

/**
 * Middleware: authenticateToken
 * Verifica token JWT emitido pelo Supabase e injeta dados do usuário em req.user.
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Valida o token com o Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.error("❌ Erro de autenticação Supabase:", error);
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    const supUser = data.user;
    const userId = supUser.id;

    // Busca o perfil vinculado no banco via Prisma
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

    // Preenche req.user com informações completas
    req.user = {
      id: userId,
      email: supUser.email ?? null,
      name: profile?.name ?? null,
      matricula: profile?.matricula ?? null,
      profilePic: profile?.profilePic ?? null,
      isAdmin: profile?.isAdmin ?? false,
      isSuperAdmin: profile?.isSuperAdmin ?? false,
    };

    next();
  } catch (err) {
    console.error("❌ Erro no authenticateToken:", err);
    return res.status(500).json({ error: "Erro no middleware de autenticação" });
  }
}
