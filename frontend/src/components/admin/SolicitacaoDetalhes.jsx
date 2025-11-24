import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Package,
  FileText,
  Check,
  X,
} from "lucide-react";

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processando, setProcessando] = useState(false);

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

      const res = await fetch(`${API_URL}/solicitacoes/${id}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Solicitação não encontrada");
        }
        throw new Error(`Erro ao carregar dados: ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Dados recebidos:", data);
      setSolicitacao(data);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(novoStatus) {
    try {
      setProcessando(true);

      // 🔥 CORREÇÃO: Adicionar token de autenticação
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch(`${API_URL}/solicitacoes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🔥 ADICIONAR TOKEN
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) {
        // Se for erro 401, redirecionar para login
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw new Error(`Erro ao atualizar status: ${res.status}`);
      }

      const data = await res.json();

      // Atualiza localmente com os dados retornados do servidor
      setSolicitacao((prev) => ({
        ...prev,
        status: novoStatus,
      }));

      // Fecha o modal
      setShowModal(false);

      // Mostra mensagem de sucesso
      alert(
        `Validação ${
          novoStatus === "aprovada" ? "aprovada" : "negada"
        } com sucesso!`
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert(err.message || "Erro ao atualizar status da validação");
    } finally {
      setProcessando(false);
    }
  }

  // Função auxiliar para verificar se pode validar
  const podeValidar = () => {
    if (!solicitacao) return false;

    const status = solicitacao.status?.toLowerCase?.();

    return (
      !status ||
      status === "pendente" ||
      status === "pending" ||
      status === "" ||
      status === null ||
      status === undefined
    );
  };

  // Função para formatar data e hora
  const formatarDataHora = (dataString) => {
    if (!dataString) return "Data não informada";

    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "Data inválida";

    return {
      data: data.toLocaleDateString("pt-BR"),
      hora: data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      completo: data.toLocaleString("pt-BR"),
    };
  };

  const dataHora = formatarDataHora(solicitacao?.createdAt);

  // Texto do botão baseado no status
  const getTextoBotao = () => {
    if (!solicitacao) return "Validar";

    const status = solicitacao.status?.toLowerCase?.();

    if (status === "aprovada") return "Validação Aprovada";
    if (status === "negada") return "Validação Negada";
    if (podeValidar()) return "Validar";

    return `Status: ${solicitacao.status || "Pendente"}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-neutral-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-300 dark:bg-neutral-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                <div className="h-32 bg-gray-300 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            ← Voltar para Admin
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="text-red-800 dark:text-red-300 text-center">
              <p className="font-bold text-lg mb-2">Erro</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            ← Voltar para Admin
          </button>
          <div className="text-red-600 dark:text-red-400 text-lg">
            Solicitação não encontrada.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300 mb-2"
            >
              ← Voltar para Admin
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detalhes da Validação #{solicitacao.id}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{dataHora.data}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{dataHora.hora}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Dados da Solicitação e Item */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card: Dados da Solicitação */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados da Validação
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.descricao || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Local da Perda
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.localPerda || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Detalhes Únicos
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.detalhesUnicos || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Conteúdo Interno
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.conteudoInterno || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Momento da Perda
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.momentoPerda || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Item Solicitado */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Item Solicitado
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Título
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {solicitacao.item?.title || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                      {solicitacao.item?.description || "Não informada"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          solicitacao.item?.status === "encontrado"
                            ? "bg-green-500 text-white"
                            : solicitacao.item?.status === "perdido"
                            ? "bg-red-500 text-white"
                            : solicitacao.item?.status === "reclamado"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {solicitacao.item?.status || "Não informado"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Categoria
                      </label>
                      <p className="text-gray-800 dark:text-gray-200">
                        {solicitacao.item?.category?.name || "Não informada"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Localização
                    </label>
                    <p className="text-gray-800 dark:text-gray-200">
                      {solicitacao.item?.location || "Não informada"}
                    </p>
                  </div>
                </div>

                {/* Imagens do Item */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Imagens do Item
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {solicitacao.item?.images?.length ? (
                      solicitacao.item.images.map((img, index) => {
                        const src = `${API_URL}${
                          img.url.startsWith("/") ? img.url : "/" + img.url
                        }`;
                        return (
                          <div key={img.id || index} className="relative group">
                            <img
                              src={src}
                              alt={solicitacao.item.title}
                              className="w-full h-32 object-cover border rounded-lg shadow-sm"
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-neutral-700 rounded-lg border">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Nenhuma imagem disponível
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Dados do Aluno e Informações Adicionais */}
          <div className="space-y-6">
            {/* Card: Dados do Aluno */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Solicitante
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {solicitacao.aluno?.profilePic ? (
                    <img
                      src={solicitacao.aluno.profilePic}
                      alt={solicitacao.aluno.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {solicitacao.aluno?.name || "Não informado"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {solicitacao.aluno?.matricula ||
                        "Matrícula não informada"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-neutral-700 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ID do Usuário
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {solicitacao.aluno?.id || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Informações da Validação */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Informações da Validação
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID da Validação
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    #{solicitacao.id}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Data de Envio
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {dataHora.data}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Hora de Envio
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {dataHora.hora}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`px-2 py-1 text-white text-xs rounded font-semibold ${
                      solicitacao.status === "aprovada"
                        ? "bg-green-500"
                        : solicitacao.status === "negada"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {solicitacao.status === "aprovada"
                      ? "Aprovada"
                      : solicitacao.status === "negada"
                      ? "Negada"
                      : "Pendente"}
                  </span>
                </div>
              </div>

              {/* 🔥 BOTÃO VALIDAR - CORRIGIDO */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={!podeValidar() || processando}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    podeValidar() && !processando
                      ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                      : "bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {processando ? "Processando..." : getTextoBotao()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL DE VALIDAÇÃO */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Validar Solicitação
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Escolha uma ação para esta validação:
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => atualizarStatus("aprovada")}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {processando ? "Processando..." : "Aprovar"}
              </button>

              <button
                onClick={() => atualizarStatus("negada")}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                {processando ? "Processando..." : "Negar"}
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              disabled={processando}
              className="w-full mt-4 py-2 px-4 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}