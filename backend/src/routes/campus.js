import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

// 🔹 GET /campus → lista todos os campus (sem precisar login)
router.get("/", async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(campus);
  } catch (err) {
    console.error("Erro ao buscar campus:", err);
    res.status(500).json({ error: "Erro ao buscar campus" });
  }
});

export default router;
