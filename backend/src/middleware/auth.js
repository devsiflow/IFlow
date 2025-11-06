// src/middleware/auth.js
import supabase from "../lib/supabaseClient.js";
import prisma from "../lib/prismaClient.js";

/**
 * authenticateToken
 * Espera header: Authorization: Bearer <token>
 * Verifica token no Supabase (getUser) e busca profile no Prisma
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Tenta obter o usuário a partir do token
    let supResp;
    try {
      // Em algumas versões getUser aceita objeto, em outras aceita string.
      // Tentar ambas (preferência: objeto { access_token })
      supResp = await supabase.auth.getUser({ access_token: token });
    } catch (err) {
      // fallback: tentar com string
      try {
        supResp = await supabase.auth.getUser(token);
      } catch (err2) {
        console.error("Supabase getUser - falha nas duas tentativas:", err, err2);
        // Se falhar aqui, tratar abaixo
      }
    }

    // Se supResp indica erro ou não trouxe usuário, tratar
    if (!supResp) {
      console.error("Supabase auth error: resposta vazia");
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Em supabase v2, erros costumam vir em supResp.error ou no campo data=null
    if (supResp.error) {
      // Detalhar erro específico de JWT expirado (bad_jwt)
      const err = supResp.error;
      console.error("Supabase auth error:", err);
      // Quando token expirou, supabase retorna erro com code 'bad_jwt' (403)
      if (err?.status === 403 || err?.code === "bad_jwt") {
        return res.status(401).json({ error: "Token expirado" });
      }
      return res.status(401).json({ error: "Token inválido" });
    }

    const supUser = supResp.data?.user;
    if (!supUser) {
      console.error("Supabase auth: usuário não retornado:", supResp);
      return res.status(401).json({ error: "Token inválido ou usuário não encontrado" });
    }

    const userId = supUser.id;

    // Busca profile no Prisma (se existir)
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

    // Popula req.user para as rotas
    req.user = {
      id: userId,
      email: supUser.email ?? null,
      name: profile?.name ?? null,
      matricula: profile?.matricula ?? null,
      profilePic: profile?.profilePic ?? null,
      isAdmin: !!profile?.isAdmin,
      isSuperAdmin: !!profile?.isSuperAdmin,
    };

    return next();
  } catch (err) {
    console.error("authenticateToken error:", err);
    // Se for erro relacionado ao supabase auth (bad_jwt) já foi tratado acima.
    return res.status(500).json({ error: "Erro no middleware de autenticação" });
  }
}
