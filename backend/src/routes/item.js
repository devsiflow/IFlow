import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* LISTAR ITENS (público) COM FILTRO POR CAMPUS */
router.get("/", async (req, res) => {
  try {
    const {
      status,
      category,
      q,
      page = 1,
      pageSize = 20,
      user,
      campusId,
    } = req.query;
    
    const where = {};

    // Filtro por campusId - CORREÇÃO IMPORTANTE
    if (campusId && campusId !== "undefined" && campusId !== "null") {
      const cid = Number(campusId);
      console.log("🎯 Filtrando por campusId:", cid);
      if (!Number.isNaN(cid)) {
        where.campusId = cid;
      } else {
        console.log("⚠️ campusId não é um número válido:", campusId);
      }
    }

    // Outros filtros mantidos
    if (status && status !== "Todos") where.status = status;
    if (category && category !== "Todos") {
      where.category = { is: { name: category } };
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (user) {
      where.userId = user;
    }

    console.log("🔍 Query where clause:", where);

    const items = await prisma.item.findMany({
      where,
      include: {
        images: true,
        category: true,
        campus: true, // Inclui dados do campus
        user: { select: { id: true, name: true, profilePic: true, campusId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const total = await prisma.item.count({ where });
    
    console.log(`✅ Retornando ${items.length} itens de ${total} total`);
    res.json({ items, total });
  } catch (err) {
    console.error("❌ Erro listando items:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});

/* LISTAR ITENS DO USUÁRIO LOGADO (autenticado) */
router.get("/meus-itens", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 20 } = req.query;

    const items = await prisma.item.findMany({
      where: { userId },
      include: {
        images: true,
        category: true,
        campus: true,
        user: { select: { id: true, name: true, profilePic: true, campusId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const total = await prisma.item.count({ where: { userId } });
    res.json({ items, total });
  } catch (err) {
    console.error("Erro listando itens do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});

/* GET ITEM POR ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        images: true,
        category: true,
        campus: true,
        user: { select: { id: true, name: true, profilePic: true, campusId: true } },
      },
    });
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    res.json(item);
  } catch (err) {
    console.error("Erro get item:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* CRIAR ITEM (autenticado) - ATUALIZADO PARA INCLUIR CAMPUS */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrls = [],
      status = "perdido",
      location,
      categoryName,
    } = req.body;
    const userId = req.user.id;

    // Validação mais robusta
    if (!title || !description || !location || !categoryName) {
      return res.status(400).json({
        error: "Preencha title, description, location e categoryName",
      });
    }

    // Buscar perfil do usuário para obter campusId
    const userProfile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { campusId: true }
    });

    // encontrar/ criar categoria
    let category = null;
    if (categoryName) {
      category = await prisma.category.findFirst({
        where: { name: categoryName },
      });
      if (!category)
        category = await prisma.category.create({
          data: { name: categoryName },
        });
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        status,
        location,
        userId,
        campusId: userProfile?.campusId || null, // Inclui campusId do usuário
        categoryId: category ? category.id : null,
        images: { create: imageUrls.map((url) => ({ url })) },
      },
      include: {
        images: true,
        category: true,
        campus: true,
        user: { select: { id: true, name: true, profilePic: true, campusId: true } },
      },
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});

// ... (restante do código mantido igual)
/* ATUALIZAR ITEM (owner ou admin/superadmin) */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, location, categoryName } = req.body;
    const requester = req.user;

    const existing = await prisma.item.findUnique({
      where: { id: Number(id) },
    });
    if (!existing)
      return res.status(404).json({ error: "Item não encontrado" });

    if (
      existing.userId !== requester.id &&
      !requester.isAdmin &&
      !requester.isSuperAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Sem permissão para editar este item" });
    }

    let category = null;
    if (categoryName) {
      category = await prisma.category.findFirst({
        where: { name: categoryName },
      });
      if (!category)
        category = await prisma.category.create({
          data: { name: categoryName },
        });
    }

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        status: status ?? existing.status,
        location: location ?? existing.location,
        categoryId: category ? category.id : existing.categoryId,
      },
      include: {
        images: true,
        category: true,
        campus: true,
        user: { select: { id: true, name: true, profilePic: true, campusId: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Erro atualizar item:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});

/* DELETAR ITEM (owner ou admin/superadmin) */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    const existing = await prisma.item.findUnique({
      where: { id: Number(id) },
    });
    if (!existing)
      return res.status(404).json({ error: "Item não encontrado" });

    if (
      existing.userId !== requester.id &&
      !requester.isAdmin &&
      !requester.isSuperAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Sem permissão para excluir este item" });
    }

    await prisma.itemImage.deleteMany({ where: { itemId: Number(id) } });
    await prisma.item.delete({ where: { id: Number(id) } });

    res.json({ message: "Item removido com sucesso" });
  } catch (err) {
    console.error("Erro deletar item:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});

export default router;