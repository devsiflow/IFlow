import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 📊 Rota do Dashboard Admin
router.get("/", async (req, res) => {
  try {
    // Total de itens cadastrados
    const totalItens = await prisma.item.count();

    // Total de perfis (usuários)
    const totalUsuarios = await prisma.profile.count();

    // Total de solicitações de validação
    const totalSolicitacoes = await prisma.itemValidation.count();

    // Itens por status
    const itensPorStatus = await prisma.item.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Itens e solicitações cadastrados por mês (últimos 12 meses)
    const itens = await prisma.item.findMany({
      select: { createdAt: true },
    });

    const solicitacoes = await prisma.itemValidation.findMany({
      select: { createdAt: true },
    });

    // Combinar itens e solicitações por mês
    const itensPorMes = {};
    
    // Processar itens
    itens.forEach((item) => {
      const mesAno = item.createdAt.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      if (!itensPorMes[mesAno]) {
        itensPorMes[mesAno] = { itens: 0, solicitacoes: 0 };
      }
      itensPorMes[mesAno].itens += 1;
    });

    // Processar solicitações
    solicitacoes.forEach((solicitacao) => {
      const mesAno = solicitacao.createdAt.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      if (!itensPorMes[mesAno]) {
        itensPorMes[mesAno] = { itens: 0, solicitacoes: 0 };
      }
      itensPorMes[mesAno].solicitacoes += 1;
    });

    res.json({
      totalItens,
      totalUsuarios,
      totalSolicitacoes,
      itensPorStatus,
      itensPorMes, // Agora inclui dados de solicitações também
    });
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
  }
});

export default router;