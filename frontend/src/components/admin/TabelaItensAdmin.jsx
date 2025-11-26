import { useEffect, useState, useCallback, useRef } from "react";
import { Pencil, Trash2, Loader2, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TabelaItensAdmin.jsx
 * Substitua seu arquivo atual por este para ter:
 * - Ícone de olho que abre modal/carrossel com imagens do item
 * - Carrossel com drag/swipe, prev/next, keyboard (ESC/←/→), clique fora para fechar
 * - Editor inline já integrado (mesma UI que você tinha)
 *
 * Observação: fotos do item devem estar em `item.images` como array de objetos { url }
 */

export default function TabelaItensAdmin() {
  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [visualizando, setVisualizando] = useState(null); // item sendo visualizado no modal

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
    } catch (err) {
      console.error("Erro carregar itens:", err);
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editando),
      });

      setEditando(null);
      carregarItens();
    } catch (err) {
      console.error("Erro salvar edição:", err);
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

      setItens((prev) => prev.filter((i) => i.id !== id));
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
        setVisualizando={setVisualizando}
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
        setVisualizando={setVisualizando}
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
        setVisualizando={setVisualizando}
      />

      <ImageCarousel item={visualizando} onClose={() => setVisualizando(null)} />
    </div>
  );
}

/* ---------------------------
   StatusSection (tabela)
   --------------------------- */
function StatusSection({
  title,
  cor,
  itens,
  editando,
  setEditando,
  deletar,
  salvando,
  salvarEdicao,
  setVisualizando,
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <h2 className={`text-xl font-bold mb-4 text-${cor}-600`}>{title} ({itens.length})</h2>

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
              <th className="p-2 text-center w-[150px]">Ações</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((item) => (
              <FragmentRow
                key={item.id}
                item={item}
                editando={editando}
                setEditando={setEditando}
                deletar={deletar}
                setVisualizando={setVisualizando}
                salvando={salvando}
                salvarEdicao={salvarEdicao}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------------------------
   FragmentRow - linha + editor expand
   --------------------------- */
function FragmentRow({ item, editando, setEditando, deletar, setVisualizando, salvando, salvarEdicao }) {
  return (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="p-2">{item.id}</td>
        <td className="p-2">{item.title}</td>
        <td className="p-2">{item.category?.name || "N/A"}</td>
        <td className="p-2">{item.user?.name || "N/A"}</td>

        <td className="p-2 flex justify-center gap-3">
          <button
            onClick={() => setVisualizando(item)}
            className="p-1 text-purple-600 hover:text-purple-800 transition"
            title="Visualizar imagens"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => setEditando(item)}
            className="p-1 text-blue-600 hover:text-blue-800 transition"
            title="Editar"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => deletar(item.id)}
            className="p-1 text-red-600 hover:text-red-800 transition"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

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
  );
}

/* ---------------------------
   ImageCarousel component
   - Recebe `item` (objeto) que tem `images: [{url}, ...]`
   - onClose()
   --------------------------- */
function ImageCarousel({ item, onClose }) {
  const [index, setIndex] = useState(0);
  const overlayRef = useRef(null);

  // reset when item muda
  useEffect(() => {
    setIndex(0);
  }, [item]);

  const urls = item?.images?.map((img) => img.url) ?? [];

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + urls.length) % urls.length);
  }, [urls.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % urls.length);
  }, [urls.length]);

  // keyboard handlers
  useEffect(() => {
    if (!item) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose, prev, next]);

  // click fora pra fechar
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        ref={overlayRef}
        onClick={onOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      >
        <motion.div
          key={item.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-4xl w-[94%] md:w-3/4 bg-transparent p-4 rounded"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          {/* Left arrow */}
          {urls.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right arrow */}
          {urls.length > 1 && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Carousel viewport */}
          <div className="overflow-hidden rounded-lg">
            <motion.div
              key={`slide-${index}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-gray-900"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                const threshold = 50;
                if (info.offset.x > threshold) prev();
                else if (info.offset.x < -threshold) next();
              }}
            >
              {urls[index] ? (
                // image
                <img
                  src={urls[index]}
                  alt={`${item.title} - imagem ${index + 1}`}
                  className="max-h-[58vh] md:max-h-[68vh] object-contain"
                />
              ) : (
                <div className="text-white px-6 py-10">Sem imagens</div>
              )}
            </motion.div>
          </div>

          {/* thumbnails */}
          {urls.length > 1 && (
            <div className="mt-3 flex justify-center items-center gap-2 overflow-x-auto">
              {urls.map((u, i) => (
                <button
                  key={u + i}
                  onClick={() => setIndex(i)}
                  className={`w-16 h-12 rounded overflow-hidden border ${i === index ? "border-blue-500" : "border-transparent"} shrink-0`}
                >
                  <img src={u} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* caption + meta */}
          <div className="mt-4 text-center text-sm text-white/90">
            <div className="font-semibold">{item.title}</div>
            <div className="text-xs mt-1">{item.description}</div>
            <div className="text-xs mt-2">{`${index + 1} / ${urls.length}`}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------
   Small helper - to avoid React complaining about missing Fragment import
   We can inline a fragment wrapper component (optional)
   --------------------------- */
function FragmentRowWrapper({ children }) {
  return <>{children}</>;
}
