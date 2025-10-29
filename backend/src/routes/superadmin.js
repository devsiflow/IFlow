import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function requireSuperAdmin(req, res, next) {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado. Apenas SuperAdmin." });
  }
  next();
}

// Listar usuários (paginado)
router.get("/users", authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query;
    const users = await prisma.profile.findMany({
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: { createdAt: "desc" }
    });
    const total = await prisma.profile.count();
    res.json({ users, total });
  } catch (err) {
    console.error("Erro listar users:", err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// Toggle admin
router.put("/users/:id/toggle-admin", authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: "Usuário não encontrado" });

    const updated = await prisma.profile.update({
      where: { id },
      data: { isAdmin: !profile.isAdmin }
    });

    res.json({ message: "Atualizado", profile: updated });
  } catch (err) {
    console.error("Erro toggle-admin:", err);
    res.status(500).json({ error: "Erro atualizando admin" });
  }
});

// Toggle superadmin (danger: só superadmin pode usar)
router.put("/users/:id/toggle-superadmin", authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: "Usuário não encontrado" });

    const updated = await prisma.profile.update({
      where: { id },
      data: { isSuperAdmin: !profile.isSuperAdmin }
    });

    res.json({ message: "Atualizado superadmin", profile: updated });
  } catch (err) {
    console.error("Erro toggle-superadmin:", err);
    res.status(500).json({ error: "Erro atualizando superadmin" });
  }
});

export default router;
