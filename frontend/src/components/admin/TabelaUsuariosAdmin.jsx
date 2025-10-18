import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TabelaUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetch("/api/admin/usuarios").then((r) => r.json()).then(setUsuarios);
  }, []);

  async function salvarEdicao() {
    await fetch(`/api/admin/usuarios/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando),
    });
    setEditando(null);
    const atualizados = await fetch("/api/admin/usuarios").then((r) => r.json());
    setUsuarios(atualizados);
  }

  async function deletarUsuario(id) {
    await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" });
    setUsuarios(usuarios.filter((u) => u.id !== id));
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="flex justify-center gap-2">
                <button onClick={() => setEditando(u)}>
                  <Pencil size={18} />
                </button>
                <button onClick={() => deletarUsuario(u.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="mt-4 p-4 border-t border-gray-300 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Editar Usuário</h3>
          <input
            className="border rounded p-2 w-full mb-2"
            value={editando.nome}
            onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
          />
          <button onClick={salvarEdicao} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
