import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Criar apenas o Profile no Prisma
router.post("/register", async (req, res) => {
  const { id, name, matricula } = req.body; // id vindo do frontend (Supabase)

  if (!id || !name || !matricula)
    return res.status(400).json({ error: "Campos obrigatórios faltando" });

  try {
    const profile = await prisma.profile.create({
      data: {
        id,
        name,
        matricula,
        profilePic: null,
      },
    });

    res.json({ message: "Profile criado!", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar profile" });
  }
});

export default router;
