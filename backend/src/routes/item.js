import express from "express";
import prisma  from "../prisma.js"; // ajuste seu path se necessário

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, description, location, status, userId, categoryName } = req.body;

  if (!title || !description || !location || !userId || !categoryName) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const item = await prisma.item.create({
      data: {
        title,
        description,
        location,
        status: status || "Perdido",
        user: { connect: { id: Number(userId) } },
        category: {
          connectOrCreate: {
            where: { name: categoryName },
            create: { name: categoryName },
          },
        },
      },
      include: {
        category: true,
        user: true,
      },
    });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar item" });
  }
});

export default router;
