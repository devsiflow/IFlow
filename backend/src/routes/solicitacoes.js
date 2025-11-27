// src/routes/solicitacoes.js - ROTA CORRIGIDA
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ===============================
   GET /solicitacoes
   Lista todas as validações
=============================== */
router.get("/", async (req, res) => {
  try {
    const validacoes = await prisma.itemValidation.findMany({
      orderBy: { id: "desc" },
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

    // Formatar resposta para manter compatibilidade
    const formatted = validacoes.map((v) => ({
      ...v,
      aluno: v.profile,
      createdAt: v.createdAt ? v.createdAt.toISOString() : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao listar validações:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   GET /solicitacoes/:id
   Detalhes de uma validação específica
=============================== */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log("🔍 GET /solicitacoes/:id - Buscando validação ID:", id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

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
        ? `Encontrada validação ID ${validacao.id} - Destino: ${validacao.destino}`
        : "Validação não encontrada"
    );

    if (!validacao) {
      return res.status(404).json({ error: "Validação não encontrada" });
    }

    // Formatar resposta para manter compatibilidade com frontend
    const response = {
      ...validacao,
      aluno: validacao.profile,
      createdAt: validacao.createdAt ? validacao.createdAt.toISOString() : null,
    };

    res.json(response);
  } catch (err) {
    console.error("❌ Erro ao buscar validação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* ===============================
   PUT /solicitacoes/:id/status
   Atualizar status da validação - AGORA FUNCIONANDO
=============================== */
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`🔄 Atualizando status da validação ${id} para: ${status}`);
    console.log(`👤 Usuário solicitante: ${req.user.id}`);

    // Verificar se o usuário é admin
    if (!req.user.isAdmin && !req.user.isSuperAdmin) {
      return res
        .status(403)
        .json({ error: "Acesso restrito a administradores" });
    }

    // ✅ CORREÇÃO: Sempre atualizar o item para "devolvido" quando a validação for aprovada
    const atualizarItem = status === "aprovada";

    // Iniciar transação para atualizar validação E item
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualizar o status da validação
      const updatedValidation = await tx.itemValidation.update({
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

      // ✅ CORREÇÃO: SEMPRE atualizar o item para "devolvido" quando aprovar
      let updatedItem = null;
      if (status === "aprovada" && updatedValidation.itemId) {
        updatedItem = await tx.item.update({
          where: { id: updatedValidation.itemId },
          data: { status: "devolvido" },
        });
        console.log(
          `✅ Item ${updatedValidation.itemId} marcado automaticamente como devolvido`
        );
      }

      return {
        validation: updatedValidation,
        item: updatedItem,
      };
    });

    // Formatar resposta para manter compatibilidade
    const response = {
      ...result.validation,
      aluno: result.validation.profile,
      createdAt: result.validation.createdAt
        ? result.validation.createdAt.toISOString()
        : null,
      // Incluir informação sobre o item atualizado
      _itemAtualizado: result.item ? true : false,
    };

    console.log(`✅ Status da validação ${id} atualizado para: ${status}`);
    if (status === "aprovada") {
      console.log(
        `📦 Item ${result.validation.itemId} marcado automaticamente como devolvido`
      );
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Erro ao atualizar status:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Validação não encontrada" });
    }

    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});
/* ===============================
   DELETE /solicitacoes/:id
   Excluir validação
=============================== */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Verificar se o usuário é admin
    if (!req.user.isAdmin && !req.user.isSuperAdmin) {
      return res
        .status(403)
        .json({ error: "Acesso restrito a administradores" });
    }

    const existing = await prisma.itemValidation.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Validação não encontrada" });
    }

    await prisma.itemValidation.delete({
      where: { id },
    });

    res.json({ message: "Validação excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar validação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
