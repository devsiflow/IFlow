import express from "express";
import { supabase } from "../supabaseClient.js";
import prisma from "../prismaClient.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { name, email, password, matricula } = req.body;
  if (!name || !email || !password || !matricula) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Cria usuário no Supabase Auth
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Cria perfil no banco com id do Supabase
    const profile = await prisma.profile.create({
      data: {
        id: user.user.id,
        name,
        matricula,
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", user: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Informe email e senha" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });

    // Busca perfil
    const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });
    res.json({ token: data.session.access_token, user: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Pegar dados do usuário logado
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  res.json(profile);
});

export default router;
