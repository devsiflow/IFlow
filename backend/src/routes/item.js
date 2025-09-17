import express from "express";
import prisma from "../db.js";

const router = express.Router();

// Criar item
router.post("/", async (req, res) => {
  try {
    const { title, description, location, status, date, image, userId, categoryId } = req.body;

    if (!title || !description || !location || !userId || !categoryId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        status: status || "perdido",
        location,
        createdAt: date ? new Date(date) : undefined,
        image_url: image || null,
        userId,
        categoryId
      },
      include: { category: true, user: true }
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
      orderBy: { createdAt: "desc" },
      include: { category: true, user: true },
    });
    res.json(items);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
