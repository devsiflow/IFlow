import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function TabelaItensAdmin() {
  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarItens();
  }, []);

  // ✅ Carrega os itens com token Supabase e backend do Render
  async function carregarItens() {
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      if (!token) {
        console.warn("❌ Nenhum token encontrado (usuário não logado).");
        return;
      }

      const response = await fetch("https://iflow-zdbx.onrender.com/items?pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📡 Resposta /items:", response.status);
      if (!response.ok) throw new Error("Erro ao carregar itens");

      const data = await response.json();
      console.log("📦 Itens recebidos:", data);
      setItens(data.items || []);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Salva alterações de item
  async function salvarEdicao() {
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      const response = await fetch(`https://iflow-zdbx.onrender.com/items/${editando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editando),
      });

      if (!response.ok) throw new Error("Erro ao atualizar item");

      setEditando(null);
      carregarItens();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao atualizar item");
    }
  }

  // ✅ Deleta item
  async function deletarItem(id) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      const response = await fetch(`https://iflow-zdbx.onrender.com/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao excluir item");

      setItens(itens.filter((i) => i.id !== id));
      alert("Item excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir item:", err);
      alert("Erro ao excluir item");
    }
  }

  if (loading) return <div className="p-4 text-center">Carregando itens...</div>;

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th className="p-2">ID</th>
            <th className="p-2">Título</th>
            <th className="p-2">Categoria</th>
            <th className="p-2">Status</th>
            <th className="p-2">Usuário</th>
            <th className="p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.title}</td>
              <td className="p-2">{item.category?.name || "N/A"}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.status === "encontrado"
                      ? "bg-green-100 text-green-800"
                      : item.status === "perdido"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="p-2">{item.user?.name || "N/A"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => setEditando(item)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deletarItem(item.id)}
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
          <h3 className="font-semibold mb-2">Editar Item</h3>
          <div className="space-y-2">
            <input
              className="border rounded p-2 w-full"
              placeholder="Título"
              value={editando.title}
              onChange={(e) => setEditando({ ...editando, title: e.target.value })}
            />
            <select
              className="border rounded p-2 w-full"
              value={editando.status}
              onChange={(e) => setEditando({ ...editando, status: e.target.value })}
            >
              <option value="perdido">Perdido</option>
              <option value="encontrado">Encontrado</option>
              <option value="devolvido">Devolvido</option>
            </select>
            <div className="flex gap-2">
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
