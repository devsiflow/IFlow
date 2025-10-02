// frontend/src/pages/ItemPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";
import Loading from "../components/loading";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({ name: "", email: "", message: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://iflow-zdbx.onrender.com/items/${id}`);
        if (!res.ok) throw new Error("Item não encontrado");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const submitClaim = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://iflow-zdbx.onrender.com/items/${id}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimantName: claimForm.name,
          claimantEmail: claimForm.email,
          message: claimForm.message,
        }),
      });
      if (!res.ok) throw new Error("Erro ao enviar solicitação");
      setMessage("Solicitação enviada com sucesso. Aguarde análise do funcionário.");
      setShowClaimModal(false);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao enviar solicitação");
    }
  };

  if (loading) return <Loading />;
  if (!item) return <p className="p-6 text-center">Item não encontrado</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1 border rounded">Voltar</button>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <img src={item.imageUrl || livroImg} alt={item.title} className="max-h-96 object-contain" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="text-gray-600 mt-2">{item.description}</p>

          <div className="mt-4 space-y-2 text-gray-800">
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Categoria:</strong> {item.category?.name || "—"}</p>
            <p><strong>Local encontrado/perdido:</strong> {item.location || item.local || "—"}</p>
            <p><strong>Data:</strong> {new Date(item.createdAt || item.date || Date.now()).toLocaleString()}</p>
            <p><strong>Contato:</strong> {item.contact || "Não informado"}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setShowClaimModal(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              É meu
            </button>
            <button onClick={() => alert("Relatar - implemente conforme necessidade")} className="px-4 py-2 border rounded hover:bg-gray-100 transition">
              Relatar
            </button>
          </div>

          {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
        </div>
      </div>

      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Solicitação: Esse item é meu</h3>
            <form onSubmit={submitClaim} className="space-y-3">
              <input
                required
                placeholder="Seu nome"
                value={claimForm.name}
                onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                required
                type="email"
                placeholder="Seu e-mail"
                value={claimForm.email}
                onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Explique por que é seu (opcional)"
                value={claimForm.message}
                onChange={(e) => setClaimForm({ ...claimForm, message: e.target.value })}
                className="w-full px-3 py-2 border rounded h-24"
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowClaimModal(false)} className="px-3 py-2 border rounded hover:bg-gray-100 transition">Cancelar</button>
                <button type="submit" className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
