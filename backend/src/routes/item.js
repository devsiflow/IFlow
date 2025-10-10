import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------- LISTAR TODOS --------------------------- */
router.get("/", async (req, res) => {
  try {
    const { status, category, q } = req.query;

    // Filtros
    const where = {};

    if (status && status !== "Todos") {
      where.status = status;
    }

    if (category) {
      where.category = { name: { equals: category } }; // ✅ correção do filtro
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // Busca no banco
    const items = await prisma.item.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        category: true,
        user: { select: { id: true, name: true, profilePic: true } },
        images: true, // ✅ traz todas as imagens do item
      },
    });

    // Formata o retorno para o frontend
    const formattedItems = items.map(item => ({
      ...item,
      images:
        item.images?.length > 0
          ? item.images.map(img => img.url)
          : [item.imageUrl], // fallback para imageUrl
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
