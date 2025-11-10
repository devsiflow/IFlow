// src/middleware/auth.js
import supabaseAdmin from "../lib/supabaseAdmin.js";
import prisma from "../lib/prismaClient.js";

/**
 * Middleware que valida o access_token do Supabase passado no header:
 * Authorization: Bearer <access_token>
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      console.warn("🚫 Nenhum token fornecido em Authorization header");
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Valida token usando o client admin do Supabase
    // (supabaseAdmin deve ser criado com SUPABASE_SERVICE_ROLE_KEY)
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      console.warn("🚫 Falha ao buscar usuário no Supabase:", error.message);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    const supUser = data?.user;
    if (!supUser || !supUser.id) {
      console.warn("🚫 supabase retornou usuário inválido:", supUser);
      return res.status(401).json({ error: "Usuário inválido" });
    }

    // Busca o profile no banco (Prisma)
    const profile = await prisma.profile.findUnique({
      where: { id: supUser.id },
    });

    // Monta req.user com informações úteis
    req.user = {
      id: supUser.id,
      email: supUser.email ?? null,
      name: profile?.name ?? null,
      matricula: profile?.matricula ?? null,
      profilePic: profile?.profilePic ?? null,
      isAdmin: !!profile?.isAdmin,
      isSuperAdmin: !!profile?.isSuperAdmin,
    };

    console.log(`✅ Usuário autenticado: ${req.user.email || req.user.id}`);
    return next();
  } catch (err) {
    // LOG detalhado pra debugging (não retorna stack pro cliente)
    console.error("🔥 Erro em authenticateToken:", err?.message ?? err);
    return res.status(500).json({ error: "Erro interno de autenticação" });
  }
}
export default authenticateToken;
