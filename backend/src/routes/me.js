import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /me → retorna perfil com campos de admin
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
        isAdmin: true,          // ✅ incluído
        isSuperAdmin: true,     // ✅ incluído
        createdAt: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Erro no GET /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /me → cria ou atualiza perfil
router.put("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, matricula, profilePic } = req.body;

    let profile = await prisma.profile.findUnique({ where: { id: userId } });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: userId,
          name: name || "Não informado",
          matricula: matricula || "Não informado",
          profilePic: profilePic || null,
        },
        select: {
          id: true,
          name: true,
          matricula: true,
          profilePic: true,
          isAdmin: true,          // ✅ incluído
          isSuperAdmin: true,     // ✅ incluído
          createdAt: true,
        },
      });
    } else {
      profile = await prisma.profile.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(matricula && { matricula }),
          ...(profilePic && { profilePic }),
        },
        select: {
          id: true,
          name: true,
          matricula: true,
          profilePic: true,
          isAdmin: true,          // ✅ incluído
          isSuperAdmin: true,     // ✅ incluído
          createdAt: true,
        },
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("Erro no PUT /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
