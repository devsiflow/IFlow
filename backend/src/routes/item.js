import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Criar item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, location, image, categoryName } = req.body;

    if (!title || !description || !location || !categoryName)
      return res.status(400).json({ error: "Campos obrigatórios faltando" });

    // Categoria fixa (não cria nova)
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (!category)
      return res.status(400).json({ error: "Categoria inválida" });

    // Cria item
    const item = await prisma.item.create({
      data: {
        title,
        description,
        location,
        status: "perdido", // status padrão
        imageUrl: image || null,
        categoryId: category.id,
        userId: req.user.id, // pega do token Supabase
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
