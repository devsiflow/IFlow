import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET - rota principal admin
router.get("/", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json({ message: "Bem-vindo à área administrativa!" });
});

// PUT - promover usuário a admin
router.put("/promote/:id", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const { id } = req.params;

  try {
    const updated = await prisma.profile.update({
      where: { id: Number(id) },
      data: { isAdmin: true },
    });

    res.json({ message: "Usuário promovido a admin", profile: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao promover admin" });
  }
});

export default router;
