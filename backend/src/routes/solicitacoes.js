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
    const solicitacoes = await prisma.solicitacao.findMany({
      orderBy: { id: "desc" },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true } }
      }
    });

    const normalized = solicitacoes.map((s) => ({
      ...s,
      data_solicitacao: s.data_solicitacao ? s.data_solicitacao.toISOString() : null
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Erro ao listar solicitações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   GET /solicitacoes/:id
   Detalhes de uma solicitação específica
=============================== */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    const solicitacao = await prisma.solicitacao.findUnique({
      where: { id },
      // // include: {
      // //   item: { include: { images: true } },
      // //   aluno: { select: { id: true, name: true } },
      // },
    });

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    res.json({
      ...solicitacao,
      data_solicitacao: solicitacao.data_solicitacao
        ? solicitacao.data_solicitacao.toISOString()
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar solicitação" });
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
        aluno_id
      },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true } }
      }
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
   PUT /solicitacoes/:id/status
   Atualizar status da solicitação
=============================== */
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status é obrigatório" });
    }

    const updated = await prisma.solicitacao.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true } }
      }
    });

    updated.data_solicitacao = updated.data_solicitacao
      ? updated.data_solicitacao.toISOString()
      : null;

    res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
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
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    await prisma.solicitacao.delete({
      where: { id }
    });

    res.json({ message: "Solicitação excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
