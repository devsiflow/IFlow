import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ------------------------
   RESOLVER NOME DO ALUNO
------------------------- */
function nomeAluno(s) {
  if (!s) return "Aluno não informado";

  const candidatos = [
    s.aluno?.name,
    s.aluno?.nome,
    s.user?.name,
    s.user?.nome,
    s.profile?.name,
    s.profile?.nome,
    s.nome,
    s.name,
  ];

  for (const c of candidatos) {
    if (c) return c;
  }

  return "Aluno não informado";
}

/* ------------------------
   FORMATAR DATA
------------------------- */
function formatarData(input) {
  if (!input && input !== 0) return "Data não informada";

  if (input instanceof Date) {
    if (isNaN(input.getTime())) return "Data inválida";
    return input.toLocaleDateString("pt-BR");
  }

  if (typeof input === "object") {
    const campos = [
      "data_solicitacao",
      "createdAt",
      "created_at",
      "data",
      "date",
      "dataSolicitacao",
    ];
    for (const c of campos) {
      if (input[c]) return formatarData(input[c]);
    }
    return "Data não informada";
  }

  const d = new Date(input);
  if (isNaN(d.getTime())) return "Data inválida";
  return d.toLocaleDateString("pt-BR");
}

/* ------------------------
   CARROSSEL IMAGENS
------------------------- */
function CarrosselImagens({ imagens = [], nome }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // 🔥 CORREÇÃO: Função para obter a URL correta da imagem
  const getImageUrl = (img) => {
    if (!img) return null;

    // Se já for uma URL completa (começa com http)
    if (
      typeof img === "string" &&
      (img.startsWith("http") || img.startsWith("https"))
    ) {
      return img;
    }

    // Se for um objeto com propriedade url
    if (typeof img === "object" && img.url) {
      return img.url.startsWith("http") ? img.url : null;
    }

    // Se for uma string sem http (caminho relativo)
    if (typeof img === "string") {
      // Remove barras extras no início se houver
      const cleanPath = img.replace(/^\//, "");
      // Constrói a URL completa do Supabase Storage
      return `https://qkisgvjvryqlbbdylvuc.supabase.co/storage/v1/object/public/iflow-item/${cleanPath}`;
    }

    return null;
  };

  // 🔥 Filtra apenas imagens válidas
  const imagensValidas = imagens
    .map((img) => getImageUrl(img))
    .filter((url) => url && url !== "null" && url !== "undefined");

  if (!imagensValidas.length) {
    return (
      <div className="w-48 h-48 flex items-center justify-center bg-gray-200 dark:bg-neutral-700 rounded-lg">
        <span className="text-gray-500 text-sm">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative w-48 h-48 overflow-hidden rounded-lg group">
      {imagensValidas.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`${nome} - ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-all duration-500 ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
          onError={(e) => {
            console.error("❌ Erro ao carregar imagem:", src);
            e.target.style.display = "none";
          }}
        />
      ))}

      {imagensValidas.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
          >
            ❮
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
          >
            ❯
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {imagensValidas.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/60"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------
   TABELA DE SOLICITAÇÕES
------------------------- */
export default function TabelaSolicitacoes({
  solicitacoes = [],
  deleteSolicitacao = () => {},
  updateStatus = () => {},
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  // 🔥 NOVA FUNÇÃO: Atualizar status
  const handleStatusUpdate = async (id, novoStatus) => {
    const success = await updateStatus(id, novoStatus);
    if (success) {
      console.log(`Status da solicitação ${id} atualizado para ${novoStatus}`);
    }
  };

  if (!solicitacoes.length)
    return (
      <div className="p-6 text-center bg-white dark:bg-neutral-800 rounded-lg text-gray-600 dark:text-gray-400">
        Nenhuma solicitação encontrada.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200 dark:bg-neutral-700">
          <tr className="text-left">
            <th className="p-3 w-10"></th>
            <th className="p-3 w-16">ID</th>
            <th className="p-3">Item</th>
            <th className="p-3">Aluno</th>
            <th className="p-3 w-32">Data</th>
            <th className="p-3 w-32">Status</th>
            <th className="p-3 w-48 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {solicitacoes.map((s) => {
            const isOpen = expandedRow === s.id;
            const dataRaw =
              s.data_solicitacao ?? s.createdAt ?? s.data ?? s.date ?? null;

            return (
              <React.Fragment key={s.id}>
                <tr className="border-b hover:bg-gray-100 dark:hover:bg-neutral-700">
                  <td
                    className="text-center cursor-pointer"
                    onClick={() => setExpandedRow(isOpen ? null : s.id)}
                  >
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </td>
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">
                    {s.item?.title ?? "Item não encontrado"}
                  </td>
                  <td className="p-3">{nomeAluno(s)}</td>
                  <td className="p-3">{formatarData(dataRaw)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-white text-xs font-semibold rounded ${
                        s.status === "aprovada"
                          ? "bg-green-500"
                          : s.status === "negada"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {s.status === "aprovada"
                        ? "Aprovada"
                        : s.status === "negada"
                        ? "Negada"
                        : "Pendente"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                        onClick={() => navigate(`/admin/solicitacoes/${s.id}`)}
                      >
                        Analisar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => deleteSolicitacao(s.id)}
                      >
                        Excluir
                      </button>
                      {/* 🔥 BOTÕES DE STATUS RÁPIDO */}
                      {s.status !== "aprovada" && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleStatusUpdate(s.id, "aprovada")}
                          title="Aprovar"
                        >
                          ✓
                        </button>
                      )}
                      {s.status !== "negada" && (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleStatusUpdate(s.id, "negada")}
                          title="Negar"
                        >
                          ✗
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {isOpen && (
                  <tr className="bg-gray-50 dark:bg-neutral-900 border-b">
                    <td colSpan={7} className="p-4">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div>
                          <CarrosselImagens
                            imagens={
                              Array.isArray(s.item?.images) &&
                              s.item.images.length > 0
                                ? s.item.images
                                : []
                            }
                            nome={s.item?.title}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-lg mb-2">
                            {s.item?.title}
                          </h3>
                          <p>
                            <span className="font-medium">Aluno: </span>
                            {nomeAluno(s)}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Status do Item:</span>
                            <span
                              className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                                s.item?.status === "encontrado"
                                  ? "bg-green-600"
                                  : s.item?.status === "perdido"
                                  ? "bg-red-600"
                                  : s.item?.status === "reclamado"
                                  ? "bg-blue-600"
                                  : "bg-gray-600"
                              }`}
                            >
                              {s.item?.status ?? "Não informado"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Data:</span>{" "}
                            {formatarData(dataRaw)}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">
                              Status da Solicitação:
                            </span>
                            <span
                              className={`px-2 py-1 text-white text-xs font-semibold rounded ${
                                s.status === "aprovada"
                                  ? "bg-green-500"
                                  : s.status === "negada"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            >
                              {s.status === "aprovada"
                                ? "Aprovada"
                                : s.status === "negada"
                                ? "Negada"
                                : "Pendente"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
