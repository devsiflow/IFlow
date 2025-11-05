import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /me
 * Retorna dados do perfil + permissões (isAdmin / isSuperAdmin)
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        matricula: true,
        profilePic: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true,
      },
    });

    // Se ainda não existir, cria um novo perfil básico
    if (!profile) {
      const newProfile = await prisma.profile.create({
        data: {
          id: userId,
          name: "Usuário sem nome",
          matricula: "Não informada",
        },
      });
      return res.json(newProfile);
    }

    res.json(profile);
  } catch (err) {
    console.error("❌ Erro no GET /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * PUT /me
 * Atualiza nome, matrícula e foto de perfil do usuário autenticado.
 */
router.put("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, matricula, profilePic } = req.body;

    const updatedProfile = await prisma.profile.upsert({
      where: { id: userId },
      update: {
        ...(name && { name }),
        ...(matricula && { matricula }),
        ...(profilePic && { profilePic }),
      },
      create: {
        id: userId,
        name: name || "Usuário sem nome",
        matricula: matricula || "Não informada",
        profilePic: profilePic || null,
      },
      select: {
        id: true,
        name: true,
        matricula: true,
        profilePic: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true,
      },
    });

    res.json(updatedProfile);
  } catch (err) {
    console.error("❌ Erro no PUT /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
