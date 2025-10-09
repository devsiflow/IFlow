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

export default router;
