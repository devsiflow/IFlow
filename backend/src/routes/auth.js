import express from "express";
import prisma from "../lib/prismaClient.js";

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


router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: error.message });
    return res.json(data.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
