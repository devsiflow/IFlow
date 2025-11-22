// routes/auth.js
import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

// Criar apenas o Profile no Prisma
router.post("/register", async (req, res) => {
  const { id, nome, matricula, campusId } = req.body;

  if (!id || !nome || !matricula || !campusId)
    return res.status(400).json({ error: "Campos obrigatórios faltando" });

  try {
    // Verificar se o campus existe
    const campus = await prisma.campus.findUnique({
      where: { id: parseInt(campusId) },
    });

    if (!campus) {
      return res.status(400).json({ error: "Campus não encontrado" });
    }

    // ✅ Criar o profile
    const profile = await prisma.profile.create({
      data: {
        id,
        name: nome,
        matricula,
        campusId: parseInt(campusId),
        profilePic: null,
      },
    });

    res.json({ message: "Profile criado!", profile });
  } catch (err) {
    console.error(err);
    
    // Se for erro de duplicação, ainda retorna sucesso
    if (err.code === 'P2002') {
      return res.json({ message: "Profile já existe", profile: null });
    }
    
    res.status(500).json({ error: "Erro ao criar profile" });
  }
});

// Rota para listar campus (usada no frontend no cadastro)
router.get("/campus", async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(campus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar campus" });
  }
});

export default router;