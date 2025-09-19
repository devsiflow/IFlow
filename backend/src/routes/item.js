import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Criar item
router.post("/", async (req, res) => {
  try {
    const { title, description, location, status, date, image, categoryName, userId } = req.body;

    if (!title || !description || !location || !status || !categoryName || !userId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Categoria
    let category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        location,
        status,
        userId,
        categoryId: category.id,
        ...(date && { createdAt: new Date(date) }),
        ...(image && { imageUrl: image }),
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Listar itens
router.get("/", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { id: "desc" },
      include: { category: true, user: true },
    });
    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
