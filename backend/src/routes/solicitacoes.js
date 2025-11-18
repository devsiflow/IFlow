// src/routes/solicitacoes.js
import express from "express";
import prisma from "../lib/prismaClient.js"; // ajuste o caminho se necessário

const router = express.Router();

// GET /solicitacoes
// Retorna lista de solicitações com item e aluno (profile) embutidos
router.get("/", async (req, res) => {
  try {
    const solicitacoes = await prisma.solicitacoes.findMany({
      include: {
        item: {
          include: {
            images: true,
          },
        },
        aluno: true,
      },
      orderBy: { id: "desc" },
    });

    // Normaliza o formato da data para garantir string ISO (evita problemas no frontend)
    const normalized = solicitacoes.map((s) => ({
      ...s,
      // data_solicitacao pode ser null — mantemos null ou ISO string
      data_solicitacao: s.data_solicitacao ? s.data_solicitacao.toISOString() : null,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Erro ao listar solicitações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /solicitacoes
// Cria solicitação; se data_solicitacao não for enviada, o DB aplicará default(now())
router.post("/", async (req, res) => {
  try {
    const { item_id, aluno_id, observacoes, data_solicitacao } = req.body;

    const data = {
      item_id,
      aluno_id,
      observacoes,
      // apenas setamos data_solicitacao se vier válida; caso contrário DB usará default
      ...(data_solicitacao ? { data_solicitacao: new Date(data_solicitacao) } : {}),
    };

    const created = await prisma.solicitacoes.create({ data });

    res.status(201).json({
      ...created,
      data_solicitacao: created.data_solicitacao ? created.data_solicitacao.toISOString() : null,
    });
  } catch (err) {
    console.error("Erro ao criar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /solicitacoes/:id/status  (atualizar status)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.solicitacoes.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({
      ...updated,
      data_solicitacao: updated.data_solicitacao ? updated.data_solicitacao.toISOString() : null,
    });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /solicitacoes/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.solicitacoes.delete({ where: { id: Number(id) } });
    res.json({ message: "Solicitação removida" });
  } catch (err) {
    console.error("Erro ao deletar solicitação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
