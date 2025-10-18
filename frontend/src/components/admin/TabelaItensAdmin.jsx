import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TabelaItensAdmin() {
  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetch("/api/admin/itens")
      .then((res) => res.json())
      .then(setItens);
  }, []);

  function handleEdit(item) {
    setEditando(item);
  }

  async function salvarEdicao() {
    await fetch(`/api/admin/itens/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando),
    });
    setEditando(null);
    const atualizados = await fetch("/api/admin/itens").then((r) => r.json());
    setItens(atualizados);
  }

  async function deletarItem(id) {
    await fetch(`/api/admin/itens/${id}`, { method: "DELETE" });
    setItens(itens.filter((i) => i.id !== id));
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th>Nome</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Usuário</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
              <td>{item.nome}</td>
              <td>{item.categoria}</td>
              <td>{item.status}</td>
              <td>{item.usuario?.nome}</td>
              <td className="flex justify-center gap-2">
                <button onClick={() => handleEdit(item)}>
                  <Pencil size={18} />
                </button>
                <button onClick={() => deletarItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="mt-4 p-4 border-t border-gray-300 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Editar Item</h3>
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
