import { useEffect, useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function TabelaItensAdmin() {
  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarItens();
  }, []);

  async function carregarItens() {
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;
      if (!token) return;

      const response = await fetch(
        "https://iflow-zdbx.onrender.com/items?admin=true&pageSize=500",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      setItens(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function salvarEdicao() {
    try {
      setSalvando(true);

      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      await fetch(`https://iflow-zdbx.onrender.com/items/${editando.id}`, {
        method: "PUT",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editando),
      });

      setEditando(null);
      carregarItens();
    } finally {
      setSalvando(false);
    }
  }

  async function deletarItem(id) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      await fetch(`https://iflow-zdbx.onrender.com/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setItens(itens.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erro ao excluir item:", err);
    }
  }

  if (loading) return <div className="p-4 text-center">Carregando itens...</div>;

  const perdidos = itens.filter((i) => i.status === "perdido");
  const encontrados = itens.filter((i) => i.status === "encontrado");
  const devolvidos = itens.filter((i) => i.status === "devolvido");

  return (
    <div className="space-y-10 animate-fadeIn">
      <StatusSection
        title="Itens Perdidos"
        cor="red"
        itens={perdidos}
        editando={editando}
        setEditando={setEditando}
        deletar={deletarItem}
        salvando={salvando}
        salvarEdicao={salvarEdicao}
      />

      <StatusSection
        title="Itens Encontrados"
        cor="blue"
        itens={encontrados}
        editando={editando}
        setEditando={setEditando}
        deletar={deletarItem}
        salvando={salvando}
        salvarEdicao={salvarEdicao}
      />

      <StatusSection
        title="Itens Devolvidos"
        cor="green"
        itens={devolvidos}
        editando={editando}
        setEditando={setEditando}
        deletar={deletarItem}
        salvando={salvando}
        salvarEdicao={salvarEdicao}
      />
    </div>
  );
}


/* ===========================================================
   COMPONENTE DE SEÇÃO — COM ANIMAÇÃO NO EDITOR
=========================================================== */
function StatusSection({
  title,
  cor,
  itens,
  editando,
  setEditando,
  deletar,
  salvando,
  salvarEdicao
}) {

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h2 className={`text-xl font-bold mb-4 text-${cor}-600`}>
        {title} ({itens.length})
      </h2>

      {itens.length === 0 ? (
        <p className="text-gray-500">Nenhum item nesta categoria.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="p-2">ID</th>
              <th className="p-2">Título</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Usuário</th>
              <th className="p-2 text-center w-[120px]">Ações</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((item) => (
              <>
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.category?.name || "N/A"}</td>
                  <td className="p-2">{item.user?.name || "N/A"}</td>

                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => setEditando(item)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deletar(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>

                {/* EDITOR ANIMADO */}
                {editando?.id === item.id && (
                  <tr>
                    <td colSpan="5">
                      <div
                        className="
                        mt-4 p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow
                        bg-gray-50 dark:bg-neutral-900
                        animate-slideDown
                      "
                      >

                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          ✏️ Editando Item #{item.id}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <div className="flex flex-col">
                            <label className="font-medium mb-1">Título</label>
                            <input
                              className="border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                              value={editando.title}
                              onChange={(e) => setEditando({ ...editando, title: e.target.value })}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="font-medium mb-1">Status</label>
                            <select
                              className="border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                              value={editando.status}
                              onChange={(e) => setEditando({ ...editando, status: e.target.value })}
                            >
                              <option value="perdido">Perdido</option>
                              <option value="encontrado">Encontrado</option>
                              <option value="devolvido">Devolvido</option>
                            </select>
                          </div>

                          <div className="flex flex-col md:col-span-2">
                            <label className="font-medium mb-1">Descrição</label>
                            <textarea
                              className="border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                              value={editando.description}
                              onChange={(e) => setEditando({ ...editando, description: e.target.value })}
                            />
                          </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setEditando(null)}
                            className="px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                          >
                            Cancelar
                          </button>

                          <button
                            onClick={salvarEdicao}
                            disabled={salvando}
                            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow flex items-center gap-2 disabled:opacity-60"
                          >
                            {salvando ? (
                              <>
                                <Loader2 className="animate-spin" size={18} />
                                Salvando...
                              </>
                            ) : (
                              "Salvar"
                            )}
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
      )}
    </div>
  );
}
