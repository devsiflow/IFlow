import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Loader2, X, ArrowLeft, ArrowRight } from "lucide-react";

const API_URL = "https://iflow-zdbx.onrender.com";

// --- Toast simples (success / error) ---
function Toasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  // exposer via window (quick hack) — você pode trocar por context se quiser
  window.__addToast = (type, text) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((s) => [...s, { id, type, text }]);
  };

  return (
    <div className="fixed right-4 top-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-lg shadow-md text-sm max-w-xs ${
            t.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

// --- Modal de imagens ---
function ImageModal({ images = [], startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex || 0);
  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-[960px] w-full bg-white dark:bg-neutral-800 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b dark:border-neutral-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Imagem {idx + 1} de {images.length}
          </div>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800">
            <X />
          </button>
        </div>

        <div className="w-full h-[min(70vh,600px)] flex items-center justify-center bg-black/5 dark:bg-black/20">
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
          >
            <ArrowLeft />
          </button>

          <img
            src={images[idx].url}
            alt={`item-img-${idx}`}
            className="max-h-[68vh] max-w-full object-contain"
          />

          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="p-3 flex justify-between items-center border-t dark:border-neutral-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">{images[idx].url}</div>
          <a
            href={images[idx].url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Abrir em nova aba
          </a>
        </div>
      </div>
    </div>
  );
}

// --- helper: fetch com timeout + retry ---
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, ...options });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default function TabelaItensAdminDeluxe() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [imagesModal, setImagesModal] = useState(null);
  const retryRef = useRef(0);

  useEffect(() => {
    carregarItensWithRetry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarItens() {
    const res = await fetchWithTimeout(
      `${API_URL}/items?admin=true&pageSize=500`,
      { method: "GET", credentials: "include", cache: "no-cache" },
      12000
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return data.items || [];
  }

  async function carregarItensWithRetry() {
    setLoading(true);
    const maxRetries = 3;
    const baseDelay = 800;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const list = await carregarItens();
        setItens(list);
        window.__addToast?.("success", "Itens carregados");
        retryRef.current = 0;
        setLoading(false);
        return;
      } catch (err) {
        attempt++;
        retryRef.current = attempt;
        console.warn("carregarItens tentativa", attempt, err.message);
        if (attempt >= maxRetries) {
          window.__addToast?.("error", "Erro ao carregar itens. Verifique a API.");
          setItens([]);
          setLoading(false);
          return;
        }
        // backoff
        await new Promise((r) => setTimeout(r, baseDelay * attempt));
      }
    }
  }

  async function salvarEdicao() {
    if (!editando) return;
    setSalvando(true);
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/items/${editando.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editando),
        },
        10000
      );
      if (!res.ok) throw new Error("Erro no servidor");
      // atualiza local sem recarregar tudo
      setItens((prev) => prev.map((p) => (p.id === editando.id ? editando : p)));
      setEditando(null);
      window.__addToast?.("success", "Item atualizado");
    } catch (err) {
      console.error(err);
      window.__addToast?.("error", "Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarItem(id) {
    if (!confirm("Confirma exclusão deste item?")) return;
    // optimistic UI
    const backup = itens;
    setItens((p) => p.filter((x) => x.id !== id));
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/items/${id}`,
        { method: "DELETE", credentials: "include" },
        8000
      );
      if (!res.ok) throw new Error("Erro ao deletar");
      window.__addToast?.("success", "Item excluído");
    } catch (err) {
      console.error(err);
      setItens(backup);
      window.__addToast?.("error", "Erro ao excluir item");
    }
  }

  // grouped lists
  const perdidos = itens.filter((i) => i.status === "perdido");
  const encontrados = itens.filter((i) => i.status === "encontrado");
  const devolvidos = itens.filter((i) => i.status === "devolvido");

  return (
    <>
      <Toasts />

      <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-[60vh]">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tabela de Itens — Deluxe</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => carregarItensWithRetry()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Loader2 className="animate-spin" size={16} />
              Recarregar
            </button>

            <div className="text-sm text-gray-500">
              {loading ? "Carregando..." : `Itens: ${itens.length}`}
              {retryRef.current > 0 && <span className="ml-2 text-xs text-yellow-600">tentativa {retryRef.current}</span>}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="w-full flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="animate-spin" />
              Carregando itens...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section
              title="Itens Perdidos"
              color="red"
              itens={perdidos}
              onEdit={setEditando}
              onDelete={deletarItem}
              onOpenImages={(imgs, idx) => setImagesModal({ imgs, idx })}
              editando={editando}
              salvarEdicao={salvarEdicao}
              salvando={salvando}
            />

            <Section
              title="Itens Encontrados"
              color="blue"
              itens={encontrados}
              onEdit={setEditando}
              onDelete={deletarItem}
              onOpenImages={(imgs, idx) => setImagesModal({ imgs, idx })}
              editando={editando}
              salvarEdicao={salvarEdicao}
              salvando={salvando}
            />

            <Section
              title="Itens Devolvidos"
              color="green"
              itens={devolvidos}
              onEdit={setEditando}
              onDelete={deletarItem}
              onOpenImages={(imgs, idx) => setImagesModal({ imgs, idx })}
              editando={editando}
              salvarEdicao={salvarEdicao}
              salvando={salvando}
            />
          </div>
        )}
      </div>

      {imagesModal && (
        <ImageModal
          images={imagesModal.imgs}
          startIndex={imagesModal.idx}
          onClose={() => setImagesModal(null)}
        />
      )}
    </>
  );
}

/* ---------------------------
   Section component (column)
   --------------------------- */
function Section({
  title,
  color = "blue",
  itens = [],
  onEdit,
  onDelete,
  onOpenImages,
  editando,
  salvarEdicao,
  salvando,
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-semibold ${color === "red" ? "text-red-600" : color === "green" ? "text-green-600" : "text-blue-600"}`}>
          {title} <span className="text-sm text-gray-500">({itens.length})</span>
        </h3>
      </div>

      {itens.length === 0 ? (
        <p className="text-gray-500">Nenhum item nesta categoria.</p>
      ) : (
        <div className="space-y-3">
          {itens.map((item) => (
            <div key={item.id} className="bg-white/60 dark:bg-neutral-900 p-3 rounded-lg border border-gray-100 dark:border-neutral-700 shadow-sm">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.category?.name || "—"} • {new Date(item.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenImages(item.images || [], 0)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                        title="Ver imagens"
                      >
                        {item.images?.length ? `${item.images.length} img` : "sem imagens"}
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-gray-500">Local: {item.location || "—"}</span>
                    <span className="text-xs text-gray-500">Usuário: {item.user?.name || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Editor inline (aparece abaixo quando editando este item) */}
              {editando?.id === item.id && (
                <div className="mt-4 animate-slideDown animate-fadeIn p-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Título</label>
                      <input
                        value={editando.title}
                        onChange={(e) => onEdit({ ...editando, title: e.target.value })}
                        className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <select
                        value={editando.status}
                        onChange={(e) => onEdit({ ...editando, status: e.target.value })}
                        className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800"
                      >
                        <option value="perdido">Perdido</option>
                        <option value="encontrado">Encontrado</option>
                        <option value="devolvido">Devolvido</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Descrição</label>
                      <textarea
                        value={editando.description}
                        onChange={(e) => onEdit({ ...editando, description: e.target.value })}
                        className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 h-24"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      className="px-3 py-1 rounded-md border hover:bg-gray-100"
                      onClick={() => onEdit(null)}
                    >
                      Cancelar
                    </button>

                    <button
                      className="px-4 py-1 rounded-md bg-green-600 text-white flex items-center gap-2 disabled:opacity-60"
                      onClick={salvarEdicao}
                      disabled={salvando}
                    >
                      {salvando ? <Loader2 className="animate-spin" /> : "Salvar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
