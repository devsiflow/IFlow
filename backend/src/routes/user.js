// routes/user.js
import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

// Endpoint para obter dados do usuário, incluindo campusId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        campus: true,  // Incluindo campus para obter o campusId
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ campusId: user.campusId });
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
