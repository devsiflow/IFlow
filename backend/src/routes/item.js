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

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, imageUrls, status, location, categoryName } = req.body;
    const userId = req.user.id;

    // Validações básicas
    if (!title || !description || !location || !categoryName) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    // Encontrar ou criar categoria
    let category = await prisma.category.findFirst({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName }
      });
    }

    // Criar item com imagens
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        status: status || "Perdido",
        location,
        userId,
        categoryId: category.id,
        imageUrl: imageUrls?.[0] || null, // Primeira imagem como principal
        images: imageUrls && imageUrls.length > 0 ? {
          create: imageUrls.map(url => ({ url }))
        } : undefined
      },
      include: {
        category: true,
        images: true,
        user: { select: { id: true, name: true, profilePic: true } }
      }
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});



export default router;
