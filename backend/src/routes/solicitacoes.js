// backend/src/routes/solicitacoes.js
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ===============================
      GET /solicitacoes
   =============================== */
router.get("/", async (req, res) => {
  try {
    const solicitacoes = await prisma.solicitacoes.findMany({
      orderBy: { id: "desc" },
      include: {
        item: {
          include: {
            images: true,
          },
        },
        aluno: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });

    // Normalizar datas para frontend
    const normalized = solicitacoes.map((s) => ({
      ...s,
      data_solicitacao: s.data_solicitacao
        ? s.data_solicitacao.toISOString()
        : null,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Erro ao listar solicitações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
      POST /solicitacoes
   =============================== */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { item_id, observacoes } = req.body;

    const aluno_id = req.user.id; // usuário logado

    const created = await prisma.solicitacoes.create({
      data: {
        item_id: Number(item_id),
        observacoes,
        aluno_id,
      },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true, profilePic: true } },
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
    PUT /solicitacoes/:id/status
   =============================== */
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.solicitacoes.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        item: { include: { images: true } },
        aluno: { select: { id: true, name: true, profilePic: true } },
      },
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
   =============================== */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.solicitacoes.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    await prisma.solicitacoes.delete({
      where: { id },
    });

    res.json({ message: "Solicitação excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
