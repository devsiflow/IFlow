// routes/auth.js
import express from "express";
import prisma from "../lib/prismaClient.js";

const router = express.Router();

// Criar apenas o Profile no Prisma
// router.post("/register", async (req, res) => {
//   const { id, nome, matricula, campusId } = req.body; // id vindo do frontend (Supabase)

//   if (!id || !nome || !matricula || !campusId)
//     return res.status(400).json({ error: "Campos obrigatórios faltando" });

//   try {
//     // Verificar se o campus existe
//     const campus = await prisma.campus.findUnique({
//       where: { id: parseInt(campusId) },
//     });

//     if (!campus) {
//       return res.status(400).json({ error: "Campus não encontrado" });
//     }

//     // ✅ Criar o profile usando o campo 'name' do schema
//     const profile = await prisma.profile.create({
//       data: {
//         id,
//         name: nome, // 👈 nome vindo do front, salvo no campo 'name'
//         matricula,
//         campusId: parseInt(campusId),
//         profilePic: null,
//       },
//     });

//     res.json({ message: "Profile criado!", profile });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erro ao criar profile" });
//   }
// });

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
