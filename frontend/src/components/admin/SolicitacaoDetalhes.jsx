import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarSolicitacao();
  }, []);

  async function carregarSolicitacao() {
    try {
      const res = await fetch(`${API_URL}/solicitacoes/${id}`);


      if (!res.ok) throw new Error("Erro ao carregar dados da solicitação");

      const data = await res.json();
      setSolicitacao(data);
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao carregar solicitação");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  if (!solicitacao)
    return (
      <div className="p-6 text-center text-red-600">
        Solicitação não encontrada.
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow">
      <button
        onClick={() => navigate("/admin")}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Solicitação #{solicitacao.id}
      </h1>

      <p className="mb-2">
        <strong>Aluno:</strong> {solicitacao.aluno?.name || "Não informado"}
      </p>

      <p className="mb-2">
        <strong>Data da Solicitação:</strong>{" "}
        {new Date(solicitacao.data_solicitacao).toLocaleDateString("pt-BR")}
      </p>

      <p className="mb-2">
        <strong>Status da Solicitação:</strong> {solicitacao.status}
      </p>

      <p className="mb-2">
        <strong>Observações:</strong>{" "}
        {solicitacao.observacoes || "Nenhuma observação fornecida"}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Item Solicitado</h2>

      <p>
        <strong>Título:</strong> {solicitacao.item?.title}
      </p>

      <p className="mt-1">
        <strong>Status do Item:</strong> {solicitacao.item?.status}
      </p>

      <div className="mt-4">
        <strong>Imagens do Item:</strong>
        <div className="flex gap-3 mt-2 flex-wrap">
          {solicitacao.item?.images?.length ? (
            solicitacao.item.images.map((img) => {
              const src = `${API_URL}${img.url}`;
              return (
                <img
                  key={img.id}
                  src={src}
                  className="w-32 h-32 object-cover border rounded-lg"
                />
              );
            })
          ) : (
            <p>Nenhuma imagem disponível.</p>
          )}
        </div>
      </div>
    </div>
  );
}
