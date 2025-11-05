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

    // Itens por status
    const itensPorStatus = await prisma.item.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Itens cadastrados por mês (últimos 12 meses)
    const itens = await prisma.item.findMany({
      select: { createdAt: true },
    });

    const itensPorMes = {};
    itens.forEach((item) => {
      const mesAno = item.createdAt.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      itensPorMes[mesAno] = (itensPorMes[mesAno] || 0) + 1;
    });

    res.json({
      totalItens,
      totalUsuarios,
      itensPorStatus,
      itensPorMes,
    });
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
  }
});

export default router;
