import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// rota para pegar usuário logado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true, name: true, matricula: true, profilePic: true, createdAt: true },
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// rota para atualizar perfil (opcional)
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, matricula, profilePic } = req.body;

    const updated = await prisma.profile.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(matricula && { matricula }),
        ...(profilePic && { profilePic }),
      },
      select: { id: true, name: true, matricula: true, profilePic: true, createdAt: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
