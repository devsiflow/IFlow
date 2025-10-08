import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configuração do multer (salva em /uploads)
const upload = multer({ dest: "uploads/" });

/* ------------------------- CRIAR ITEM COM MINIATURA ------------------------ */
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, local, categoryName } = req.body;

    if (!title || !description || (!location && !local) || !categoryName) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const finalLocation = location || local;

    // Criação de URLs de imagem
    let imageUrl = null;
    let thumbnailUrl = null;

    // Se o usuário enviou imagem
    if (req.file) {
      const originalPath = req.file.path;
      const fileName = `thumb-${Date.now()}-${req.file.originalname}`;
      const thumbPath = `uploads/thumbnails/${fileName}`;

      // Gera miniatura (200x200)
      await sharp(originalPath)
        .resize(200, 200, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(thumbPath);

      imageUrl = "/" + originalPath.replace(/\\/g, "/");
      thumbnailUrl = "/" + thumbPath.replace(/\\/g, "/");
    }

    // Verifica ou cria categoria
    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Verifica perfil
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
    });
    if (!profile) {
      return res.status(400).json({
        error: "Perfil não encontrado. Crie seu perfil antes de cadastrar itens.",
      });
    }

    // Cria o item
    const item = await prisma.item.create({
      data: {
        title,
        description,
        location: finalLocation,
        status: "perdido",
        imageUrl,
        thumbnailUrl,
        categoryId: category.id,
        userId: req.user.id,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ---------------------------- LISTAR TODOS --------------------------- */
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
        user: { select: { id: true, name: true, profilePic: true } },
      },
    });

    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ---------------------------- ACHAR POR ID ---------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        user: { select: { id: true, name: true, profilePic: true } },
      },
    });

    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    res.json(item);
  } catch (err) {
    console.error("Erro ao buscar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ---------------------- ITENS DO USUÁRIO AUTENTICADO ---------------------- */
router.get("/me/items", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: { category: true },
    });

    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ---------------------------- REMOVER ITEM ---------------------------- */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    // Verifica permissão
    if (item.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para excluir este item" });
    }

    // Remove imagens locais se existirem
    if (item.imageUrl) {
      const fullPath = path.join(process.cwd(), item.imageUrl.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    if (item.thumbnailUrl) {
      const thumbPath = path.join(process.cwd(), item.thumbnailUrl.replace(/^\//, ""));
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Item removido com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
