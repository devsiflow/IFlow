import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Loader2, X, User, Mail, IdCard, MapPin } from "lucide-react";

export default function TabelaUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [visualizando, setVisualizando] = useState(null);
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
      console.log("📊 Dados dos usuários recebidos:", data); // ✅ DEBUG
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
        body: JSON.stringify({
          name: editando.name,
          isAdmin: editando.isAdmin,
          isSuperAdmin: editando.isSuperAdmin
        }),
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

  function formatarData(data) {
    if (!data) return "—";
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 overflow-x-auto">
      {/* Modal de Visualização */}
      {visualizando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <User size={24} />
                Detalhes do Usuário
              </h2>
              <button
                onClick={() => setVisualizando(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4">
              {/* Foto de Perfil */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                  {visualizando.profilePic ? (
                    <img 
                      src={visualizando.profilePic} 
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Informações do Usuário */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                  <User className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {visualizando.name || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                  <IdCard className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Matrícula</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {visualizando.matricula || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                  <MapPin className="text-orange-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Campus</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {visualizando.campus?.nome || "Não informado"}
                    </p>
                    {/* DEBUG: Mostrar dados do campus */}
                    {console.log("📌 Dados do usuário visualizado:", visualizando)}
                    {console.log("🏫 Campus data:", visualizando.campus)}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${
                      visualizando.isSuperAdmin ? 'bg-purple-500' : 
                      visualizando.isAdmin ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Usuário</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {papel(visualizando)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setVisualizando(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setEditando(visualizando);
                  setVisualizando(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300">
            <th className="py-2">Nome</th>
            <th>Campus</th>
            <th>Status</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2">{u.name}</td>
              <td>{u.campus?.nome || "Não informado"}</td>
              <td>{papel(u)}</td>
              <td className="py-2 flex justify-center gap-2">
                <button
                  className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                  onClick={() => setVisualizando(u)}
                  title="Visualizar detalhes"
                >
                  <Eye size={18} />
                </button>

                <button
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  onClick={() => setEditando(u)}
                  title="Editar usuário"
                >
                  <Pencil size={18} />
                </button>

                <button
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  onClick={() => deletarUsuario(u.id)}
                  title="Excluir usuário"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Editor inline */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Editar Usuário
              </h2>
              <button
                onClick={() => setEditando(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
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
                  <label className="text-sm text-gray-600 dark:text-gray-300">Matrícula</label>
                  <input
                    value={editando.matricula}
                    onChange={(e) => setEditando({ ...editando, matricula: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Campus</label>
                  <input
                    value={editando.campus?.nome || "Não informado"}
                    disabled
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 bg-gray-100 dark:bg-neutral-700 cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editando.isAdmin}
                      onChange={(e) => setEditando({ ...editando, isAdmin: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Administrador</span>
                  </label>
                </div>

                <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editando.isSuperAdmin}
                      onChange={(e) => setEditando({ ...editando, isSuperAdmin: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-purple-700 dark:text-purple-300">Super Admin</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditando(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={salvarEdicao}
                  disabled={salvando}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-60 transition-colors"
                >
                  {salvando ? <Loader2 className="animate-spin" size={18} /> : null}
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}