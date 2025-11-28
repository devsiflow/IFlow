import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";



const router = express.Router();

/*
    🔹 GET /campus
*/
router.get("/", async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      orderBy: { nome: "asc" },
    });

    res.json(campus);
  } catch (err) {
    console.error("Erro ao buscar campus:", err);
    res.status(500).json({ error: "Erro ao buscar campus" });
  }
});

/*
    🔹 POST /campus
*/
router.post("/", authenticateToken, async (req, res) => {
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const campus = await prisma.campus.create({
      data: { nome },
    });

    res.status(201).json(campus);
  } catch (err) {
    console.error("Erro ao criar campus:", err);
    res.status(500).json({ error: "Erro ao criar campus" });
  }
});

/*
    🔹 PUT /campus/:id
*/
router.put("/:id", authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const campus = await prisma.campus.update({
      where: { id },
      data: { nome },
    });

    res.json(campus);
  } catch (err) {
    console.error("Erro ao atualizar campus:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Campus não encontrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar campus" });
  }
});

/*
    🔹 DELETE /campus/:id
*/
router.delete("/:id", authenticateToken, async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.campus.delete({
      where: { id },
    });

    res.json({ message: "Campus excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir campus:", err);

    // Campus tem itens ou perfis vinculados
    if (err.code === "P2003") {
      return res.status(400).json({
        error:
          "Não é possível excluir este campus, pois existem itens ou usuários vinculados a ele.",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Campus não encontrado" });
    }

    res.status(500).json({ error: "Erro ao excluir campus" });
  }
});

export default router;
