import { useEffect, useState } from "react";

export default function TabelaUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [edit, setEdit] = useState(null);
  const token = localStorage.getItem("token");

  const loadUsuarios = async () => {
    const res = await fetch("/api/admin/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuarios(data.usuarios || []);
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const salvar = async () => {
    const res = await fetch(`/api/admin/usuarios/${edit.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      setEdit(null);
      loadUsuarios();
    }
  };

  const remover = async (id) => {
    if (!confirm("Deseja remover o usuário?")) return;
    await fetch(`/api/admin/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsuarios();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
      <table className="min-w-full bg-white dark:bg-gray-800 border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2">Nome</th>
            <th className="p-2">Matrícula</th>
            <th className="p-2">Admin</th>
            <th className="p-2">SuperAdmin</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">
                {edit?.id === u.id ? (
                  <input
                    className="bg-transparent border p-1"
                    value={edit.name}
                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td className="p-2">
                {edit?.id === u.id ? (
                  <input
                    className="bg-transparent border p-1"
                    value={edit.matricula}
                    onChange={(e) => setEdit({ ...edit, matricula: e.target.value })}
                  />
                ) : (
                  u.matricula
                )}
              </td>
              <td className="p-2">
                {edit?.id === u.id ? (
                  <input
                    type="checkbox"
                    checked={edit.isAdmin}
                    onChange={(e) => setEdit({ ...edit, isAdmin: e.target.checked })}
                  />
                ) : u.isAdmin ? "✅" : "❌"}
              </td>
              <td className="p-2">
                {edit?.id === u.id ? (
                  <input
                    type="checkbox"
                    checked={edit.isSuperAdmin}
                    onChange={(e) => setEdit({ ...edit, isSuperAdmin: e.target.checked })}
                  />
                ) : u.isSuperAdmin ? "✅" : "❌"}
              </td>
              <td className="p-2 space-x-2">
                {edit?.id === u.id ? (
                  <>
                    <button className="text-green-600" onClick={salvar}>💾</button>
                    <button onClick={() => setEdit(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEdit(u)}>✏️</button>
                    <button onClick={() => remover(u.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
