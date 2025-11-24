import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (id) {
      carregarSolicitacao();
    }
  }, [id]);

  async function carregarSolicitacao() {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "🔍 Fazendo requisição para:",
        `${API_URL}/solicitacoes/${id}`
      );

      const res = await fetch(`${API_URL}/solicitacoes/${id}`);

      console.log("📊 Status da resposta:", res.status);

      if (!res.ok) {
        // Tenta obter mais detalhes do erro
        let errorDetails = `Erro ${res.status}`;
        try {
          const errorData = await res.json();
          errorDetails = errorData.error || errorData.message || errorDetails;
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          // Se não conseguir parsear JSON, usa o status
        }

        throw new Error(`Erro ao carregar dados: ${errorDetails}`);
      }

      const data = await res.json();
      console.log("✅ Dados recebidos:", data);
      setSolicitacao(data);
    } catch (err) {
      console.error("❌ Erro detalhado:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          ← Voltar
        </button>
        <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="p-6 text-center text-red-600">
        Solicitação não encontrada.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow">
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
      >
        ← Voltar para Admin
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Detalhes da Solicitação #{solicitacao.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Informações da Solicitação */}
        <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Informações da Solicitação
          </h2>
          <div className="space-y-2">
            <p>
              <strong className="text-gray-700 dark:text-gray-300">
                Aluno:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {solicitacao.aluno?.name || "Não informado"}
              </span>
            </p>
            <p>
              <strong className="text-gray-700 dark:text-gray-300">
                Matrícula:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {solicitacao.aluno?.matricula || "Não informada"}
              </span>
            </p>
            <p>
              <strong className="text-gray-700 dark:text-gray-300">
                Data:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(solicitacao.data_solicitacao).toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </p>
            <p>
              <strong className="text-gray-700 dark:text-gray-300">
                Status:
              </strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  solicitacao.status === "pendente"
                    ? "bg-yellow-500 text-white"
                    : solicitacao.status === "aprovada"
                    ? "bg-green-500 text-white"
                    : solicitacao.status === "rejeitada"
                    ? "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {solicitacao.status}
              </span>
            </p>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Observações
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {solicitacao.observacoes || "Nenhuma observação fornecida"}
          </p>
        </div>
      </div>

      {/* Informações do Item */}
      <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Item Solicitado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2">
              <strong className="text-gray-700 dark:text-gray-300">
                Título:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {solicitacao.item?.title}
              </span>
            </p>
            <p className="mb-2">
              <strong className="text-gray-700 dark:text-gray-300">
                Descrição:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {solicitacao.item?.description}
              </span>
            </p>
            <p className="mb-2">
              <strong className="text-gray-700 dark:text-gray-300">
                Local:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {solicitacao.item?.location}
              </span>
            </p>
            <p className="mb-2">
              <strong className="text-gray-700 dark:text-gray-300">
                Status:
              </strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  solicitacao.item?.status === "encontrado"
                    ? "bg-green-500 text-white"
                    : solicitacao.item?.status === "perdido"
                    ? "bg-red-500 text-white"
                    : solicitacao.item?.status === "reclamado"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {solicitacao.item?.status}
              </span>
            </p>
            {solicitacao.item?.category && (
              <p className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300">
                  Categoria:
                </strong>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {solicitacao.item.category.name}
                </span>
              </p>
            )}
          </div>

          {/* Imagens do Item */}
          <div>
            <strong className="text-gray-700 dark:text-gray-300 block mb-2">
              Imagens do Item:
            </strong>
            <div className="flex gap-3 flex-wrap">
              {solicitacao.item?.images?.length ? (
                solicitacao.item.images.map((img) => {
                  const src = `${API_URL}${
                    img.url.startsWith("/") ? img.url : "/" + img.url
                  }`;
                  return (
                    <img
                      key={img.id}
                      src={src}
                      alt={solicitacao.item.title}
                      className="w-32 h-32 object-cover border rounded-lg shadow-sm"
                    />
                  );
                })
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-200 dark:bg-neutral-600 rounded-lg">
                  <span className="text-gray-500 text-sm">Sem imagem</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
