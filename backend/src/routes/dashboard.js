// src/routes/dashboard.js
import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Totais
    const totalItens = await prisma.item.count();
    const totalUsuarios = await prisma.user.count();

    // Itens por status (para gráfico de pizza)
    const itensPorStatus = await prisma.item.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Itens criados por mês (para gráfico de linha)
    const itensPorMesDB = await prisma.item.findMany({
      select: { createdAt: true },
    });

    const itensPorMes = {};
    itensPorMesDB.forEach((item) => {
      const mes = new Date(item.createdAt).toLocaleString("pt-BR", {
        month: "short",
      });
      itensPorMes[mes] = (itensPorMes[mes] || 0) + 1;
    });

    res.json({
      totalItens,
      totalUsuarios,
      itensPorStatus,
      itensPorMes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
});

export default router;
