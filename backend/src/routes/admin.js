// backend/routes/admin.js
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";
import supabase from "../lib/supabaseClient.js";

const router = express.Router();

// --- Middleware: verificar se é admin ou superadmin ---
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin && !req.user?.isSuperAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
};

// --- Endpoint básico (teste) ---
router.get("/usuarios", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Painel administrativo ativo" });
});

// --- Listar usuários ---
router.get("/usuarios", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const usuarios = await prisma.profile.findMany({
      select: {
        id: true,
        name: true,
        matricula: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ usuarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// --- Atualizar usuário ---
router.put("/usuarios/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, matricula, isAdmin, isSuperAdmin } = req.body;

  if (!req.user.isSuperAdmin && isSuperAdmin === true) {
    return res.status(403).json({ error: "Somente superadmin pode promover" });
  }

  try {
    const updated = await prisma.profile.update({
      where: { id },
      data: { name, matricula, isAdmin, isSuperAdmin },
    });
    res.json({ message: "Usuário atualizado", profile: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// --- Deletar usuário ---
router.delete("/usuarios/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Tenta deletar no Supabase
    try {
      await supabase.auth.admin.deleteUser(id);
    } catch (err) {
      console.warn("Falha Supabase Auth:", err.message);
    }

    await prisma.profile.delete({ where: { id } });
    res.json({ message: "Usuário removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// --- Reset de senha ---
router.post("/usuarios/:id/reset-password", authenticateToken, requireAdmin, async (req, res) => {
  const { method = "email", email, newPassword, uid } = req.body;

  try {
    if (method === "email") {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: "Email de reset enviado" });
    }

    if (method === "direct") {
      if (!req.user.isSuperAdmin)
        return res.status(403).json({ error: "Apenas superadmin pode redefinir diretamente" });
      const { data, error } = await supabase.auth.admin.updateUserById(uid, { password: newPassword });
      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: "Senha atualizada", user: data });
    }

    res.status(400).json({ error: "Método inválido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
});

export default router;
