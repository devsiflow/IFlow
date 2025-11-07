import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js"; // se tiver auth do supabase, pode deixar opcional

const router = express.Router();

// POST - salvar respostas de validação
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      itemId,
      descricao,
      localPerda,
      detalhesUnicos,
      conteudoInterno,
      momentoPerda,
    } = req.body;

    if (
      !itemId ||
      !descricao ||
      !localPerda ||
      !detalhesUnicos ||
      !conteudoInterno ||
      !momentoPerda
    ) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const newValidation = await prisma.itemValidation.create({
      data: {
        userId: req.user?.id || null,
        itemId,
        descricao,
        localPerda,
        detalhesUnicos,
        conteudoInterno,
        momentoPerda,
      },
    });

    res.status(201).json(newValidation);
  } catch (error) {
    console.error("Erro ao salvar validação:", error);
    res.status(500).json({ error: "Erro ao salvar validação." });
  }
});

// GET - listar todas as validações (para o admin)
router.get("/", async (req, res) => {
  try {
    const validations = await prisma.itemValidation.findMany({
      include: {
        item: true,
        profile: true, // ✅ nome certo do relacionamento
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(validations);
  } catch (error) {
    console.error("Erro ao listar validações:", error);
    res.status(500).json({ error: "Erro ao listar validações." });
  }
});



export default router;
