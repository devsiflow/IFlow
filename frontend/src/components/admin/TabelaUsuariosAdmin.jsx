import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Loader2 } from "lucide-react";

export default function TabelaUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao carregar usuários");

      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function salvarEdicao() {
    try {
      setSalvando(true);

      const res = await fetch(`${API_URL}/admin/usuarios/${editando.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editando),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setEditando(null);
      carregarUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar edição");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarUsuario(id) {
    if (!confirm("Excluir usuário?")) return;

    try {
      await fetch(`${API_URL}/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function papel(u) {
    if (u.isSuperAdmin)
      return <span className="font-bold text-purple-600 uppercase">SUPERADMIN</span>;

    if (u.isAdmin)
      return <span className="font-bold text-green-600 uppercase">ADMIN</span>;

    return <span className="text-gray-500">Usuário</span>;
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 overflow-x-auto">

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300">
            <th className="py-2">Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <>

              {/* Linha normal */}
              <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2">{u.name}</td>
                <td>{u.email || "—"}</td>
                <td>{papel(u)}</td>

                <td className="py-2 flex justify-center gap-2">
                  <button
                    className="p-1 text-purple-600 hover:text-purple-800"
                    onClick={() => (window.location.href = `/admin/items?userId=${u.id}`)}
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setEditando(u)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    onClick={() => deletarUsuario(u.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>

              {/* Editor animado */}
              {editando?.id === u.id && (
                <tr>
                  <td colSpan="4" className="p-0">
                    <div className="animate-slideDown fadeCard mt-3 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900">

                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Editar Usuário
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-300">Nome</label>
                          <input
                            value={editando.name}
                            onChange={(e) => setEditando({ ...editando, name: e.target.value })}
                            className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
                          <input
                            value={editando.email}
                            onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                            className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-300">Senha</label>
                          <input
                            type={mostrarSenha ? "text" : "password"}
                            value={editando.senha || ""}
                            onChange={(e) =>
                              setEditando({ ...editando, senha: e.target.value })
                            }
                            className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                          />
                        </div>

                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setEditando(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={salvarEdicao}
                          disabled={salvando}
                          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-60"
                        >
                          {salvando ? <Loader2 className="animate-spin" size={18} /> : null}
                          Salvar
                        </button>
                      </div>

                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
