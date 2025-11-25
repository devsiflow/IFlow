import express from "express"; 
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import supabaseAdmin from "../lib/supabaseAdmin.js";

const router = express.Router();

/* ============================================================
   LISTAR ITENS (PÚBLICO) — COM FILTRO DE CAMPUS AUTOMÁTICO
   ============================================================ */
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
      allCampuses = false,
    } = req.query;
    
    const where = {};

    // Autenticação do token para obter campus do usuário (mantido)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let userCampusId = null;

    if (token && !allCampuses) {
      try {
        if (process.env.SUPABASE_JWT_SECRET) {
          const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
          const userId = decoded.sub || decoded.id;
          if (userId) {
            const userProfile = await prisma.profile.findUnique({
              where: { id: userId },
              select: { campusId: true }
            });
            userCampusId = userProfile?.campusId;
          }
        }
      } catch (err) {
        try {
          const result = await supabaseAdmin.auth.getUser(token);
          if (result?.data?.user) {
            const userId = result.data.user.id;
            const userProfile = await prisma.profile.findUnique({
              where: { id: userId },
              select: { campusId: true }
            });
            userCampusId = userProfile?.campusId;
          }
        } catch (supaErr) {
          console.log("Erro ao obter campus do usuário:", supaErr);
        }
      }
    }

    if (userCampusId && !allCampuses) {
      where.campusId = userCampusId;
    } else if (campusId && campusId !== "undefined" && campusId !== "null") {
      const cid = Number(campusId);
      if (!Number.isNaN(cid)) {
        where.campusId = cid;
      }
    }

    // ------- STATUS: por padrão, listar apenas 'encontrado' no catálogo público -------
    // Se o cliente passou ?status=..., respeitamos. Caso contrário, por padrão mostramos apenas 'encontrado'.
    if (status && status !== "Todos") {
      where.status = status;
    } else if (!status) {
      // comportamento padrão do catálogo público:
      where.status = "encontrado";
    }

    if (category && category !== "Todos") {
      where.category = { name: category };
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

    const items = await prisma.item.findMany({
      where,
      include: {
        images: true,
        category: true,
        campus: true,
        user: { 
          select: { id: true, name: true, profilePic: true, campusId: true } 
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const total = await prisma.item.count({ where });
    res.json({ items, total, userCampusId });

  } catch (err) {
    console.error("❌ Erro listando items:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});
/* ============================================================
   LISTAR ITENS DO USUÁRIO LOGADO
   ============================================================ */
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

/* ============================================================
   GET ITEM POR ID
   ============================================================ */
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

/* ============================================================
   CRIAR ITEM — INCLUINDO CAMPUS AUTOMÁTICO DO USUÁRIO
   ============================================================ */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrls = [],
      status, 
      location,
      categoryName,
    } = req.body;

    const userId = req.user.id;

    if (!title || !description || !location || !categoryName) {
      return res.status(400).json({
        error: "Preencha title, description, location e categoryName",
      });
    }

    // busca o campus do usuário
    const userProfile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { campusId: true }
    });

    let category = null;
    if (categoryName) {
      category = await prisma.category.findFirst({
        where: { name: categoryName },
      });
      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName },
        });
      }
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        status,
        location,
        userId,
        campusId: userProfile?.campusId || null,
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

/* ============================================================
   ATUALIZAR ITEM
   ============================================================ */
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

/* ============================================================
   DELETAR ITEM
   ============================================================ */
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