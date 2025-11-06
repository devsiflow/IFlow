import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";

export default function TabelaUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao carregar usuários");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("❌ Erro ao carregar usuários:", err);
    }
  }

  async function salvarEdicao() {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${editando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editando),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao salvar edição");
      setEditando(null);
      carregarUsuarios();
    } catch (err) {
      console.error("❌ Erro ao salvar edição:", err);
      alert("Erro ao salvar edição.");
    }
  }

  async function deletarUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao deletar usuário");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("❌ Erro ao deletar usuário:", err);
      alert("Erro ao deletar usuário.");
    }
  }

  function abrirItensDoUsuario(userId) {
    window.location.href = `/admin/items?userId=${userId}`;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th>Nome</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Super</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
              <td>{u.name}</td>
              <td>{u.email || "—"}</td>
              <td>{u.isAdmin ? "✅" : "❌"}</td>
              <td>{u.isSuperAdmin ? "⭐" : "—"}</td>
              <td className="flex justify-center gap-2">
                <button
                  onClick={() => abrirItensDoUsuario(u.id)}
                  title="Ver itens desse usuário"
                  className="p-1 text-purple-600 hover:text-purple-800"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => setEditando(u)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deletarUsuario(u.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="mt-4 p-4 border-t border-gray-300 dark:border-gray-700">
          <h3 className="font-semibold mb-3">Editar Usuário</h3>

          <div className="space-y-3">
            <input
              className="border rounded p-2 w-full"
              placeholder="Nome"
              value={editando.name || ""}
              onChange={(e) =>
                setEditando({ ...editando, name: e.target.value })
              }
            />
            <input
              className="border rounded p-2 w-full"
              placeholder="Email"
              value={editando.email || ""}
              onChange={(e) =>
                setEditando({ ...editando, email: e.target.value })
              }
            />
            <div className="relative">
              <input
                className="border rounded p-2 w-full pr-10"
                placeholder="Nova senha (opcional)"
                type={mostrarSenha ? "text" : "password"}
                value={editando.senha || ""}
                onChange={(e) =>
                  setEditando({ ...editando, senha: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                <Eye size={18} />
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={salvarEdicao}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditando(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
