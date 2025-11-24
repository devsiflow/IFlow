// backend/src/routes/solicitacoes.js
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ===============================
   GET /solicitacoes
   Lista todas as solicitações
=============================== */
router.get("/", async (req, res) => {
  try {
    const validacoes = await prisma.itemValidation.findMany({
      orderBy: { id: "desc" },
      include: {
        item: { include: { images: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const normalized = validacoes.map((v) => ({
      ...v,
      // Mapear profile para aluno para manter compatibilidade
      aluno: v.profile,
      createdAt: v.createdAt ? v.createdAt.toISOString() : null,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Erro ao listar validações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   GET /solicitacoes/:id
   Detalhes de uma solicitação específica - CÓDIGO CORRIGIDO
=============================== */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log("🔍 GET /solicitacoes/:id - Buscando validação ID:", id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // 🔥 CORREÇÃO: Use itemValidation em vez de solicitacao
    const validacao = await prisma.itemValidation.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            images: true,
            category: true,
            campus: true,
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        // No model ItemValidation, o relacionamento com Profile se chama "profile", não "aluno"
        profile: {
          select: {
            id: true,
            name: true,
            matricula: true,
            profilePic: true,
          },
        },
      },
    });

    console.log(
      "📤 Resultado:",
      validacao
        ? `Encontrada validação ID ${validacao.id}`
        : "Validação não encontrada"
    );

    if (!validacao) {
      return res.status(404).json({ error: "Validação não encontrada" });
    }

    res.json({
      ...validacao,
      // Mapear profile para aluno para manter compatibilidade com frontend
      aluno: validacao.profile,
      createdAt: validacao.createdAt ? validacao.createdAt.toISOString() : null,
    });
  } catch (err) {
    console.error("❌ Erro ao buscar validação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   PUT /solicitacoes/:id/status
   Atualizar status da solicitação - CÓDIGO CORRIGIDO
=============================== */
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`🔄 Atualizando status da validação ${id} para: ${status}`);

    // 🔥 CORREÇÃO: Usar itemValidation em vez de solicitacao
    const updated = await prisma.itemValidation.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        item: {
          include: {
            images: true,
            category: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
            matricula: true,
            profilePic: true,
          },
        },
      },
    });

    // Mapear profile para aluno para manter compatibilidade
    const response = {
      ...updated,
      aluno: updated.profile,
      createdAt: updated.createdAt ? updated.createdAt.toISOString() : null,
    };

    console.log(`✅ Status da validação ${id} atualizado para: ${status}`);
    res.json(response);
  } catch (err) {
    console.error("❌ Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

/* ===============================
   POST /solicitacoes
   Criar uma nova solicitação
=============================== */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { item_id, observacoes } = req.body;
    const aluno_id = req.user.id;

    if (!item_id) {
      return res.status(400).json({ error: "Item_id é obrigatório" });
    }

    const created = await prisma.solicitacao.create({
      data: {
        item_id: Number(item_id),
        observacoes,
        aluno_id,
      },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true } },
      },
    });

    created.data_solicitacao = created.data_solicitacao
      ? created.data_solicitacao.toISOString()
      : null;

    res.status(201).json(created);
  } catch (err) {
    console.error("Erro ao criar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   DELETE /solicitacoes/:id
   Excluir solicitação
=============================== */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.solicitacao.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    await prisma.solicitacao.delete({
      where: { id },
    });

    res.json({ message: "Solicitação excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;