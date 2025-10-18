import prisma from "../lib/prismaClient.js";
import bcrypt from "bcrypt";

// === USUÁRIOS ===
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nome: true, email: true, role: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, role } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { nome, email, role },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await prisma.user.update({
      where: { id },
      data: { senha: senhaCriptografada },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
}

// === ITENS ===
export async function getAllItems(req, res) {
  try {
    const itens = await prisma.item.findMany({
      include: { usuario: { select: { nome: true, email: true } } },
    });
    res.json(itens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar itens" });
  }
}

export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, local, categoria, status } = req.body;

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data: { nome, descricao, local, categoria, status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
}

export async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await prisma.item.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir item" });
  }
}
