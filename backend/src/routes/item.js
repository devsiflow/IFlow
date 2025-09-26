import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Criar item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, location, local, image, categoryName } = req.body;

    if (!title || !description || (!location && !local) || !categoryName) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Se frontend mandar `local` em vez de `location`
    const finalLocation = location || local;

    // Verifica categoria (cria se não existir)
    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Verifica se perfil existe
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id }, // req.user.id = UUID do Supabase
    });

    if (!profile) {
      return res.status(400).json({
        error: "Perfil não encontrado. Crie seu perfil antes de cadastrar itens.",
      });
    }

    // Cria item associado ao perfil
    const item = await prisma.item.create({
      data: {
        title,
        description,
        location: finalLocation,
        status: "perdido",
        imageUrl: image || null,
        categoryId: category.id,
        profileId: profile.id, // 🔴 corrigido: salvar pelo profileId
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Listar todos os itens (marketplace)
router.get("/", async (req, res) => {
  try {
    const { status, category, q } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = { name: category };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        category: true,
        profile: { select: { id: true, name: true, profilePic: true } }, // 🔴 corrigido: usar profile
      },
    });

    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Listar itens do usuário autenticado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { profileId: req.user.id }, // 🔴 corrigido
      orderBy: { id: "desc" },
      include: { category: true },
    });

    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
