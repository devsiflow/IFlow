// src/routes/me.js - VERSÃO CORRIGIDA
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// campos selecionados em várias respostas
const PROFILE_SELECT = {
  id: true,
  name: true,
  matricula: true,
  profilePic: true,
  isAdmin: true,
  isSuperAdmin: true,
  createdAt: true,
  campusId: true,
  campus: {
    select: {
      id: true,
      nome: true,
    },
  },
};

// GET /me → retorna perfil com campos de admin
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuário não autenticado" });

    // ✅ CORREÇÃO: Remover email da query do Prisma
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: PROFILE_SELECT, // ✅ Usar o SELECT corrigido
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    // ✅ Email vem do middleware auth (req.user)
    const result = {
      ...profile,
      email: req.user.email ?? null,
    };

    return res.json(result);
  } catch (err) {
    console.error("Erro no GET /me:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /me → cria ou atualiza perfil
router.put("/", authenticateToken, async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuário não autenticado" });

    const { name, matricula, profilePic } = req.body ?? {};

    // validações básicas
    if (
      name !== undefined &&
      !(typeof name === "string" && name.length <= 200)
    ) {
      return res
        .status(400)
        .json({ error: "Nome inválido (máx 200 caracteres)" });
    }

    if (
      matricula !== undefined &&
      !(typeof matricula === "string" && matricula.length <= 100)
    ) {
      return res
        .status(400)
        .json({ error: "Matrícula inválida (máx 100 caracteres)" });
    }

    if (
      req.body.hasOwnProperty("profilePic") &&
      !isValidProfilePic(profilePic)
    ) {
      return res.status(400).json({ error: "profilePic inválido" });
    }

    // buscar perfil existente
    let profile = await prisma.profile.findUnique({ where: { id: userId } });

    if (!profile) {
      // criar novo perfil
      const createData = {
        id: userId,
        name: isNonEmptyString(name) ? name : "Não informado",
        matricula: isNonEmptyString(matricula) ? matricula : String(userId),
        profilePic: req.body.hasOwnProperty("profilePic") ? profilePic : null,
      };

      profile = await prisma.profile.create({
        data: createData,
        select: PROFILE_SELECT,
      });

      return res.status(201).json(profile);
    }

    // atualizar somente propriedades presentes no body
    const updateData = {};
    if (req.body.hasOwnProperty("name")) updateData.name = name;
    if (req.body.hasOwnProperty("matricula")) updateData.matricula = matricula;
    if (req.body.hasOwnProperty("profilePic"))
      updateData.profilePic = profilePic;

    // se nenhum campo para atualizar, retorna o perfil atual
    if (Object.keys(updateData).length === 0) {
      return res.json(profile);
    }

    profile = await prisma.profile.update({
      where: { id: userId },
      data: updateData,
      select: PROFILE_SELECT,
    });

    return res.json(profile);
  } catch (err) {
    console.error("Erro no PUT /me:", err);
    // Prisma unique constraint error (duplicate matricula)
    if (err && err.code === "P2002") {
      return res
        .status(409)
        .json({
          error: "Conflito de valor único (matrícula já existe)",
          details: err.meta,
        });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
