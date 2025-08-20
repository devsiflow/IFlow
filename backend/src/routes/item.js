import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Criar item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, location, categoryId } = req.body;
    const item = await prisma.item.create({
      data: {
        title,
        description,
        status,
        location,
        userId: req.user.id,
        categoryId,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// Listar itens
router.get("/", async (req, res) => {
  const items = await prisma.item.findMany({
    include: { user: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

export default router;
