import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

// Buscar todos os campus
router.get("/", async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    });

    res.json(campus);
} catch (err) {
  console.error("Erro ao buscar campus:", err.message);
  res.status(500).json({ error: "Erro ao buscar campus", details: err.message });
}
});

export default router;
