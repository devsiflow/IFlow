import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Registro
router.post("/register", async (req, res) => {
  const { name, email, password, matricula } = req.body;

  if (!name || !email || !password || !matricula) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { matricula }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, matricula, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "Usuário registrado com sucesso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, matricula, password } = req.body;

  if (!password || (!email && !matricula)) {
    return res.status(400).json({ error: "Informe a matrícula ou o e-mail e a senha" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          matricula ? { matricula } : undefined,
        ].filter(Boolean),
      },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, matricula: user.matricula },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
