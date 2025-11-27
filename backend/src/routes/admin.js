// src/routes/admin.js
import express from "express";
import prisma from "../lib/prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Middleware para permitir apenas admins/superadmins
function onlyAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Não autenticado" });
  if (!req.user.isAdmin && !req.user.isSuperAdmin)
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  next();
}

// GET /admin/usuarios
router.get("/usuarios", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    console.log("🟢 BACKEND: Iniciando busca de usuários...");

    const profiles = await prisma.profile.findMany({
      select: {
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
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`🟢 BACKEND: ${profiles.length} usuários encontrados`);

    // DEBUG: Verificar se o campus está sendo carregado
    profiles.forEach((profile, index) => {
      console.log(`👤 Usuário ${index + 1}: ${profile.name}`);
      console.log(`   📍 campusId: ${profile.campusId}`);
      console.log(`   🏫 campus:`, profile.campus);
      console.log(`   ---`);
    });

    const mapped = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      matricula: p.matricula,
      profilePic: p.profilePic,
      isAdmin: p.isAdmin,
      isSuperAdmin: p.isSuperAdmin,
      createdAt: p.createdAt,
      campusId: p.campusId,
      campus: p.campus,
      role: p.isSuperAdmin ? "superadmin" : p.isAdmin ? "admin" : "user",
    }));

    console.log("🟢 BACKEND: Enviando resposta para frontend");
    res.json(mapped);
  } catch (err) {
    console.error("❌ BACKEND: Erro GET /admin/usuarios:", err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// PUT /admin/usuarios/:id
router.put("/usuarios/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isAdmin, isSuperAdmin } = req.body;

    const updated = await prisma.profile.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(typeof isAdmin === "boolean" && { isAdmin }),
        ...(typeof isSuperAdmin === "boolean" && { isSuperAdmin }),
      },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Erro PUT /admin/usuarios/:id:", err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE /admin/usuarios/:id
router.delete(
  "/usuarios/:id",
  authenticateToken,
  onlyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log("🗑️ === INICIANDO EXCLUSÃO DE USUÁRIO ===");
      console.log("📝 ID do usuário a excluir:", id);
      console.log("👤 Usuário logado:", req.user.id);
      console.log("🎯 É superadmin?", req.user.isSuperAdmin);

      // Verificar se o usuário existe
      const usuario = await prisma.profile.findUnique({
        where: { id },
      });

      if (!usuario) {
        console.log("❌ Usuário não encontrado");
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      console.log("📋 Usuário encontrado:", {
        id: usuario.id,
        name: usuario.name,
        isAdmin: usuario.isAdmin,
        isSuperAdmin: usuario.isSuperAdmin,
      });

      // Não permitir que o usuário exclua a si mesmo
      if (id === req.user.id) {
        console.log("❌ Usuário tentou excluir a si mesmo");
        return res
          .status(400)
          .json({ error: "Não é possível excluir seu próprio usuário" });
      }

      // Não permitir que admins comuns excluam superadmins
      if (!req.user.isSuperAdmin && usuario.isSuperAdmin) {
        console.log("❌ Admin comum tentou excluir superadmin");
        return res.status(403).json({
          error: "Apenas superadmins podem excluir outros superadmins",
        });
      }

      console.log("💾 Executando exclusão no banco...");

      // Primeiro, verificar se há dependências
      try {
        // Verificar se o usuário tem itens
        const itensCount = await prisma.item.count({
          where: { userId: id },
        });

        // Verificar se o usuário tem validações
        const validacoesCount = await prisma.itemValidation.count({
          where: { userId: id },
        });

        console.log("📊 Dependências encontradas:");
        console.log("   Itens:", itensCount);
        console.log("   Validações:", validacoesCount);

        if (itensCount > 0 || validacoesCount > 0) {
          console.log("🔄 Excluindo dependências primeiro...");

          // Excluir validações primeiro
          if (validacoesCount > 0) {
            await prisma.itemValidation.deleteMany({
              where: { userId: id },
            });
            console.log("✅ Validações excluídas");
          }

          // Excluir itens e suas imagens
          if (itensCount > 0) {
            // Primeiro excluir as imagens dos itens
            const itens = await prisma.item.findMany({
              where: { userId: id },
              select: { id: true },
            });

            for (const item of itens) {
              await prisma.itemImage.deleteMany({
                where: { itemId: item.id },
              });
            }

            // Depois excluir os itens
            await prisma.item.deleteMany({
              where: { userId: id },
            });
            console.log("✅ Itens e imagens excluídos");
          }
        }
      } catch (dependencyError) {
        console.error("❌ Erro ao excluir dependências:", dependencyError);
        throw new Error(
          `Erro ao limpar dependências: ${dependencyError.message}`
        );
      }

      // Agora excluir o usuário
      await prisma.profile.delete({
        where: { id },
      });

      console.log("✅ Usuário excluído com sucesso");
      console.log("=== FIM DA EXCLUSÃO ===");

      res.json({
        ok: true,
        message: "Usuário excluído com sucesso",
      });
    } catch (err) {
      console.error("💥 ERRO NA EXCLUSÃO:");
      console.error("Mensagem:", err.message);
      console.error("Código:", err.code);
      console.error("Stack:", err.stack);

      // Tratar erros específicos do Prisma
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          error:
            "Não é possível excluir usuário com dados vinculados. Tente novamente.",
        });
      }

      res.status(500).json({
        error: "Erro interno ao excluir usuário: " + err.message,
      });
    }
  }
);

// ==========================
// 🔍 Itens por usuário (para admins)
// ==========================
router.get("/items", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const itens = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    res.json(itens);
  } catch (error) {
    console.error("❌ Erro ao buscar itens do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar itens do usuário" });
  }
});

// GET /admin/campus
router.get("/campus", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const campus = await prisma.campus.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(campus);
  } catch (err) {
    console.error("❌ Erro GET /admin/campus:", err);
    res.status(500).json({ error: "Erro ao listar campus" });
  }
});

// POST /admin/campus
router.post("/campus", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome do campus é obrigatório" });
    }

    const campus = await prisma.campus.create({
      data: { nome },
    });

    res.json(campus);
  } catch (err) {
    console.error("❌ Erro POST /admin/campus:", err);
    res.status(500).json({ error: "Erro ao criar campus" });
  }
});

// PUT /admin/campus/:id
router.put("/campus/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome do campus é obrigatório" });
    }

    const campus = await prisma.campus.update({
      where: { id: parseInt(id) },
      data: { nome },
    });

    res.json(campus);
  } catch (err) {
    console.error("❌ Erro PUT /admin/campus/:id:", err);
    res.status(500).json({ error: "Erro ao atualizar campus" });
  }
});

// DELETE /admin/campus/:id
router.delete("/campus/:id", authenticateToken, onlyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.campus.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Campus excluído com sucesso" });
  } catch (err) {
    console.error("❌ Erro DELETE /admin/campus/:id:", err);

    if (err.code === "P2003") {
      return res.status(400).json({
        error: "Não é possível excluir campus com usuários ou itens vinculados",
      });
    }

    res.status(500).json({ error: "Erro ao excluir campus" });
  }
});

export default router;
