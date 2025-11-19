import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  if (!imagens?.length)
    return (
      <div className="w-48 h-48 flex items-center justify-center bg-gray-200 dark:bg-neutral-700 rounded-lg">
        <span className="text-gray-500 text-sm">Sem imagem</span>
      </div>
    );

  return (
    <div className="relative w-48 h-48 overflow-hidden rounded-lg group">
      {imagens.map((img, index) => {
        const src = typeof img === "string" ? img : img?.url ?? "";

        const final = `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }${src.startsWith("/") ? src : "/" + src}`;

        return (
          <img
            key={index}
            src={final}
            alt={nome}
            className={`absolute w-full h-full object-cover transition-all duration-500 ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        );
      })}

      {imagens.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            ❮
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            ❯
          </button>
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
  updateStatus = () => {},
  deleteSolicitacao = () => {},
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  function calcularTag(data) {
    const d = new Date(data);
    if (isNaN(d.getTime())) return "Recente";
    const dias = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (dias >= 90) return "Mais de 90 dias";
    if (dias >= 60) return "Mais de 60 dias";
    if (dias >= 45) return "Mais de 45 dias";
    if (dias >= 30) return "Mais de 30 dias";
    if (dias >= 15) return "Mais de 15 dias";
    return "Recente";
  }

  if (!solicitacoes.length)
    return (
      <div className="p-6 text-center bg-white dark:bg-neutral-800 rounded-lg">
        Nenhuma solicitação encontrada.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <table className="w-full text-sm border-collapse">
        {/* CABEÇALHO */}
        <thead className="bg-gray-200 dark:bg-neutral-700">
          <tr className="text-left">
            <th className="p-3 w-10"></th>
            <th className="p-3 w-16">ID</th>
            <th className="p-3">Item</th>
            <th className="p-3">Aluno</th>
            <th className="p-3 w-32">Data</th>
            <th className="p-3 w-32">Tag</th>
            <th className="p-3 w-48 text-center">Ações</th>
          </tr>
        </thead>

        {/* LINHAS */}
        <tbody>
          {solicitacoes.map((s) => {
            const isOpen = expandedRow === s.id;
            const dataRaw =
              s.data_solicitacao ?? s.createdAt ?? s.data ?? s.date ?? null;

            return (
              <>
                {/* LINHA PRINCIPAL */}
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
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

                  <td className="p-3 font-semibold">{calcularTag(dataRaw)}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => updateStatus(s.id, "em análise")}
                      >
                        Analisar
                      </button>

                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => updateStatus(s.id, "solucionado")}
                      >
                        Solucionar
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => deleteSolicitacao(s.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>

                {/* LINHA EXPANDIDA */}
                {isOpen && (
                  <tr className="bg-gray-50 dark:bg-neutral-900 border-b">
                    <td colSpan={7} className="p-4">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* IMAGEM DO ITEM - GARANTIDA */}
                        <div>
                          <CarrosselImagens
                            imagens={
                              Array.isArray(s.item?.images) &&
                              s.item.images.length > 0
                                ? s.item.images.map((img) =>
                                    typeof img === "string" ? img : img?.url
                                  )
                                : ["/sem-imagem.png"] // fallback
                            }
                            nome={s.item?.title}
                          />
                        </div>

                        {/* INFORMAÇÕES */}
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-lg mb-2">
                            {s.item?.title}
                          </h3>

                          <p>
                            <span className="font-medium">Aluno: </span>
                            {nomeAluno(s)}
                          </p>

                          {/* STATUS DO ITEM COM BADGE */}
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Status do Item:</span>

                            <span
                              className={`
                                px-2 py-1 rounded text-white text-xs font-semibold
                                ${
                                  s.item?.status === "encontrado"
                                    ? "bg-green-600"
                                    : s.item?.status === "perdido"
                                    ? "bg-red-600"
                                    : s.item?.status === "reclamado"
                                    ? "bg-blue-600"
                                    : "bg-green-600"
                                }
                              `}>
                              {s.item?.status ?? "Não informado"}
                            </span>
                          </p>

                          <p>
                            <span className="font-medium">Data:</span>{" "}
                            {formatarData(dataRaw)}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
