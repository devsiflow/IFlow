// src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Rota de registro
router.post("/register", async (req, res) => {
  const { name, email, password, matricula } = req.body;

  if (!name || !email || !password || !matricula) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Verifica se já existe usuário com email ou matrícula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { matricula }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        matricula,
        password: hashedPassword,
      },
    });

    // Gera token JWT
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
