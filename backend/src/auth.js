import { Router } from "express";
import { supabase } from "../supabaseClient.js";
import prisma from "../lib/prisma.js";

const router = Router();

// Cadastro
router.post("/register", async (req, res) => {
  const { email, password, name, matricula } = req.body;

  try {
    // Cria usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    const user = data.user;

    // Cria Profile associado
    await prisma.profile.create({
      data: {
        id: user.id, // mesmo id do Supabase
        name,
        matricula,
        profilePic: null,
      },
    });

    res.json({ message: "Usuário cadastrado! Confirme seu email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Login (já usa o Supabase)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json(data); // retorna session + user
});

export default router;
