import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------- LISTAR ITENS ---------------------------- */
router.get("/", async (req, res) => {
  try {
    const { status, category, q } = req.query;
    const where = {};

    if (status && status !== "Todos") where.status = status;
    if (category) where.category = { name: { equals: category } };
    if (q)
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];

    const items = await prisma.item.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        category: true,
        user: { select: { id: true, name: true, profilePic: true } },
        images: true,
      },
    });

    const formattedItems = items.map((item) => ({
      ...item,
      images:
        item.images?.length > 0
          ? item.images.map((img) => img.url)
          : [item.imageUrl],
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error("❌ Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ---------------------------- CRIAR ITEM ---------------------------- */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, location, categoryName, images } = req.body;

    if (!title || !description || !location || !categoryName) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // verifica categoria
    let category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // cria item
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        location,
        categoryId: category.id,
        userId: req.user.id,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
      include: { category: true, images: true },
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Erro ao cadastrar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
