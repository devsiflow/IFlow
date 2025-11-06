import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET - rota principal admin
router.get("/", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin && !req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json({ message: "Bem-vindo à área administrativa!" });
});

// PUT - promover usuário a admin (apenas SuperAdmin)
router.put("/promote/:id", authenticateToken, async (req, res) => {
  if (!req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado. Apenas SuperAdmin pode promover" });
  }

  try {
    const { id } = req.params; // id é string uuid do Profile
    const updated = await prisma.profile.update({
      where: { id },
      data: { isAdmin: true },
    });

    res.json({ message: "Usuário promovido a admin", profile: updated });
  } catch (err) {
    console.error("Erro promote:", err);
    res.status(500).json({ error: "Erro ao promover admin" });
  }
});

// PUT - remover permissão de admin (apenas SuperAdmin)
router.put("/demote/:id", authenticateToken, async (req, res) => {
  if (!req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado. Apenas SuperAdmin pode demitir" });
  }

  try {
    const { id } = req.params;
    const updated = await prisma.profile.update({
      where: { id },
      data: { isAdmin: false },
    });

    res.json({ message: "Usuário removido do grupo admin", profile: updated });
  } catch (err) {
    console.error("Erro demote:", err);
    res.status(500).json({ error: "Erro ao demitir admin" });
  }
});

export default router;
