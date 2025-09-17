// src/routes/item.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Criar item
router.post("/", async (req, res) => {
  try {
    const { title, description, location, status, date, image, categoryName, userId } = req.body;

    // Validação simples
    if (!title || !description || !location || !status || !categoryName || !userId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Verifica se a categoria existe, senão cria
    let category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Cria o item
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
      include: { category: true, user: true }
    });
    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
