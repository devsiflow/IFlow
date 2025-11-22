// src/routes/admin.js
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Middleware para permitir apenas admins/superadmins
function onlyAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Não autenticado" });
  if (!req.user.isAdmin && !req.user.isSuperAdmin)
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  next();
}

// GET /admin/usuarios
router.get("/usuarios", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        name: true,
        matricula: true,
        profilePic: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      matricula: p.matricula,
      role: p.isSuperAdmin ? "superadmin" : p.isAdmin ? "admin" : "user",
      profilePic: p.profilePic,
      isAdmin: p.isAdmin,
      isSuperAdmin: p.isSuperAdmin,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("❌ Erro GET /admin/usuarios:", err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// PUT /admin/usuarios/:id
router.put("/usuarios/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isAdmin, isSuperAdmin } = req.body;

    const updated = await prisma.profile.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(typeof isAdmin === "boolean" && { isAdmin }),
        ...(typeof isSuperAdmin === "boolean" && { isSuperAdmin }),
      },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Erro PUT /admin/usuarios/:id:", err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE /admin/usuarios/:id
router.delete("/usuarios/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.profile.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Erro DELETE /admin/usuarios/:id:", err);
    res.status(500).json({ error: "Erro ao remover usuário" });
  }
});



// ==========================
// 🔍 Itens por usuário (para admins)
// ==========================
router.get("/items", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const itens = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    res.json(itens);
  } catch (error) {
    console.error("❌ Erro ao buscar itens do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar itens do usuário" });
  }
});

// GET /admin/campus
router.get("/campus", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(campus);
  } catch (err) {
    console.error("❌ Erro GET /admin/campus:", err);
    res.status(500).json({ error: "Erro ao listar campus" });
  }
});

// POST /admin/campus
router.post("/campus", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome do campus é obrigatório" });
    }

    const campus = await prisma.campus.create({
      data: { nome },
    });

    res.json(campus);
  } catch (err) {
    console.error("❌ Erro POST /admin/campus:", err);
    res.status(500).json({ error: "Erro ao criar campus" });
  }
});

// PUT /admin/campus/:id
router.put("/campus/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome do campus é obrigatório" });
    }

    const campus = await prisma.campus.update({
      where: { id: parseInt(id) },
      data: { nome },
    });

    res.json(campus);
  } catch (err) {
    console.error("❌ Erro PUT /admin/campus/:id:", err);
    res.status(500).json({ error: "Erro ao atualizar campus" });
  }
});

// DELETE /admin/campus/:id
router.delete("/campus/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.campus.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Campus excluído com sucesso" });
  } catch (err) {
    console.error("❌ Erro DELETE /admin/campus/:id:", err);
    
    if (err.code === "P2003") {
      return res.status(400).json({ 
        error: "Não é possível excluir campus com usuários ou itens vinculados" 
      });
    }
    
    res.status(500).json({ error: "Erro ao excluir campus" });
  }
});

export default router;
