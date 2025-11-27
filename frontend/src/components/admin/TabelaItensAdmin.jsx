import { useEffect, useState, useCallback, useRef } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Link as LinkIcon,
  Copy,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader"; 



function formatDateHelper(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

/* ----------------------
   Helper de classe de status (único ponto)
   ---------------------- */
function getStatusClass(status) {
  if (!status) return "bg-gray-500 text-white";
  const s = String(status).toLowerCase();
  if (s.includes("perd")) return "bg-red-300 text-red-800";
  if (s.includes("encontr")) return "bg-blue-300 text-blue-800";
  if (s.includes("devol")) return "bg-green-300 text-green-800";
  return "bg-gray-200 text-gray-800";
}

export default function TabelaItensAdmin() {
  const navigate = useNavigate();

  const [itens, setItens] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [visualizando, setVisualizando] = useState(null); // item atual do modal

  useEffect(() => {
    carregarItens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return <Loader message="Carregando solicitações..." />;
  }

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
        navigate={navigate}
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
        navigate={navigate}
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
        navigate={navigate}
      />

      <DeluxeModal
        item={visualizando}
        onClose={() => setVisualizando(null)}
        navigate={navigate}
      />
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
  navigate,
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
                salvando={salvando}
                salvarEdicao={salvarEdicao}
                navigate={navigate}
                setVisualizando={setVisualizando}
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
function FragmentRow({
  item,
  editando,
  setEditando,
  deletar,
  setVisualizando,
  salvando,
  salvarEdicao,
  navigate,
}) {
  return (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="p-2">{item.id}</td>
        <td className="p-2">{item.title}</td>
        <td className="p-2">{item.category?.name || "N/A"}</td>
        <td className="p-2">{item.user?.name || "N/A"}</td>

        <td className="p-2 flex justify-center gap-3">
          {/* Eye abre POPUP deluxe */}
          <button
            onClick={() => setVisualizando(item)}
            className="p-1 text-purple-600 hover:text-purple-800 transition"
            title="Visualizar imagens e detalhes"
            aria-label={`Visualizar ${item.title}`}
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
            <div className="mt-4 p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow bg-gray-50 dark:bg-neutral-900 animate-slideDown">
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
   DeluxeModal (popup com carrossel + detalhes)
   - props: item, onClose(), navigate
   --------------------------- */
function DeluxeModal({ item, onClose, navigate }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [loadedMap, setLoadedMap] = useState({}); // { url: true }
  const overlayRef = useRef(null);

  // reset when item muda
  useEffect(() => {
    setIndex(0);
    setZoomed(false);
    setLoadedMap({});
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
      if (e.key === "z" || e.key === "Z") setZoomed((z) => !z);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose, prev, next]);

  // click fora pra fechar
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(item.id));
      alert("ID copiado para a área de transferência!");
    } catch {
      alert("Não foi possível copiar o ID.");
    }
  };

  // timeline render: prefer item.history (array of {status, by, at}), fallback to single current status
  const renderTimelineContent = useCallback(
    (it) => {
      const hist =
        Array.isArray(it.history) && it.history.length > 0
          ? it.history
          : [{ status: it.status, by: it.user?.name || "Sistema", at: it.created_at }];

      return hist.map((h, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full mt-2 bg-white/20" />
          <div className="text-xs text-gray-300">
            <div className="font-medium capitalize">{h.status}</div>
            <div>{h.by}</div>
            <div className="text-xs text-gray-400">{formatDateHelper(h.at)}</div>
          </div>
        </div>
      ));
    },
    []
  );

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="deluxe-overlay"
        ref={overlayRef}
        onClick={onOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        {/* backdrop blur + gradient */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          key={`deluxe-${item.id}`}
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-50 max-w-6xl w-[96%] md:w-4/5 lg:w-3/4 bg-gradient-to-b from-neutral-900/90 to-neutral-900/80 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => {
                setZoomed(false);
                onClose();
              }}
              className="bg-black/60 hover:bg-black/40 text-white p-2 rounded-full"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* LEFT: carousel */}
            <div className="flex flex-col gap-3">
              <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center min-h-[300px] h-[55vh] md:h-[60vh]">
                {/* left arrow */}
                {urls.length > 1 && (
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/60 hover:bg-black/40 p-2"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={22} color="white" />
                  </button>
                )}

                {/* image / skeleton */}
                <div className="w-full h-full flex items-center justify-center">
                  {urls[index] ? (
                    <motion.img
                      key={urls[index]}
                      src={urls[index]}
                      alt={`${item.title} - imagem ${index + 1}`}
                      onDoubleClick={() => setZoomed((z) => !z)}
                      onLoad={() => setLoadedMap((m) => ({ ...m, [urls[index]]: true }))}
                      initial={{ opacity: 0.85 }}
                      animate={loadedMap[urls[index]] ? { opacity: 1 } : { opacity: 0.85 }}
                      transition={{ duration: 0.4 }}
                      className={`max-h-[52vh] md:max-h-[62vh] object-contain select-none ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                        }`}
                      style={{
                        transform: zoomed ? "scale(1.9)" : "scale(1)",
                        transition: "transform 300ms ease",
                      }}
                    />
                  ) : (
                    <div className="text-white px-6 py-10">Sem imagens</div>
                  )}

                  {/* skeleton while not loaded */}
                  {!loadedMap[urls[index]] && urls[index] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-6 rounded-md bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />
                    </div>
                  )}

                  {/* right arrow */}
                  {urls.length > 1 && (
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/60 hover:bg-black/40 p-2"
                      aria-label="Próximo"
                    >
                      <ChevronRight size={22} color="white" />
                    </button>
                  )}
                </div>

                {/* zoom + open full */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 z-40">
                  <button
                    onClick={() => setZoomed((z) => !z)}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/40 text-white px-3 py-1 rounded"
                    aria-label="Zoom"
                  >
                    <ZoomIn size={16} />
                    <span className="text-xs">Zoom</span>
                  </button>

                  <button
                    onClick={() => {
                      const u = urls[index];
                      if (u) window.open(u, "_blank");
                    }}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/40 text-white px-3 py-1 rounded"
                    aria-label="Abrir imagem em nova aba"
                  >
                    <LinkIcon size={16} />
                    <span className="text-xs">Abrir</span>
                  </button>
                </div>
              </div>

              {/* thumbnails */}
              {urls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 px-1">
                  {urls.map((u, i) => (
                    <button
                      key={u + i}
                      onClick={() => {
                        setIndex(i);
                        setZoomed(false);
                      }}
                      className={`w-20 h-14 rounded overflow-hidden border-2 shrink-0 transition transform ${i === index
                        ? "border-blue-400 scale-105"
                        : "border-transparent hover:scale-105"
                        }`}
                      aria-label={`Ir para imagem ${i + 1}`}
                    >
                      <img src={u} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: details */}
            <div className="text-gray-100 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <div className="text-sm text-gray-300 mt-1">{item.category?.name || "Sem categoria"}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/itempage/${item.id}`)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Ver item completo
                    </button>

                    <button
                      onClick={copyId}
                      className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 rounded"
                      aria-label="Copiar ID do item"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <div className="text-xs text-gray-400">{`#${item.id}`}</div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
                {item.tags?.map((t) => (
                  <span key={t} className="px-2 py-1 rounded text-xs bg-white/5 text-gray-200">
                    {t}
                  </span>
                ))}
              </div>

              <div className="bg-gradient-to-b from-white/5 to-white/3 p-4 rounded-lg">
                <div className="text-sm text-gray-300 whitespace-pre-wrap">{item.description || "Sem descrição"}</div>

                <div className="mt-3 text-xs text-gray-400">
                  <div>Quem criou: <span className="font-medium text-gray-200">{item.user?.name || "—"}</span></div>
                  <div>Campus: <span className="font-medium text-gray-200">{item.campus?.nome || "—"}</span></div>
                  <div>Criado em: <span className="font-medium text-gray-200">{formatDateHelper(item.created_at)}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Timeline</h4>
                <div className="flex flex-col gap-3">{renderTimelineContent(item)}</div>
              </div>

              <div className="mt-auto flex gap-2">
                <a
                  href={`mailto:devsiflow@gmail.com?subject=Sobre%20item%20${encodeURIComponent(item.id)}&body=Ol%C3%A1%2C%20preciso%20de%20suporte%20sobre%20o%20item%20${encodeURIComponent(item.id)}`}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded"
                >
                  Reportar problema
                </a>

                <button
                  onClick={() => {
                    if (item.externalUrl) window.open(item.externalUrl, "_blank");
                    else alert("Nenhum link externo disponível para este item.");
                  }}
                  className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded"
                >
                  Abrir externo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
