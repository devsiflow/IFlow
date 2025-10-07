import express from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json({ message: "Bem-vindo à área administrativa!" });
});


// routes/admin.js
router.put("/promote/:id", authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
    }
    
    const { id } = req.params;
    
    try {
        const updated = await prisma.profile.update({
            where: { id: Number(id) },
            data: { isAdmin: true },
        });
        res.json({ message: "Usuário promovido a admin", profile: updated });
    } catch (err) {
        res.status(500).json({ error: "Erro ao promover admin" });
    }
});

export default router;