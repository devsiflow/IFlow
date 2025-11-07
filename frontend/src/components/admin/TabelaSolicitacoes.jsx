import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ===========
   🖼️ Carrossel igual ao do cliente
   =========== */
function CarrosselImagens({ imagens, nome }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="relative w-48 h-48 overflow-hidden rounded-lg group">
      {imagens.map((img, index) => (
        <img
          key={index}
          src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
            img.startsWith("/") ? img : "/" + img
          }`}
          alt={nome}
          className={`absolute w-full h-full object-cover transition-all duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {imagens.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black/90 transition"
          >
            ❮
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black/90 transition"
          >
            ❯
          </button>
        </>
      )}
    </div>
  );
}

/* ===========
   📋 Tabela de Solicitações do Admin
   =========== */
export default function TabelaSolicitacoes({
  solicitacoes,
  updateStatus,
  deleteSolicitacao,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  function calcularTag(dataSolicitacao) {
    const dias = Math.floor(
      (new Date() - new Date(dataSolicitacao)) / (1000 * 60 * 60 * 24)
    );
    if (dias >= 90) return "Mais de 90 dias";
    if (dias >= 60) return "Mais de 60 dias";
    if (dias >= 45) return "Mais de 45 dias";
    if (dias >= 30) return "Mais de 30 dias";
    if (dias >= 15) return "Mais de 15 dias";
    return "Recente";
  }

  if (!solicitacoes.length)
    return (
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow text-center text-gray-600 dark:text-gray-300">
        Nenhuma solicitação encontrada.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200 dark:bg-neutral-700">
          <tr>
            <th className="p-2"></th>
            <th>ID</th>
            <th>Item</th>
            <th>Aluno</th>
            <th>Descrição</th>
            <th>Local da Perda</th>
            <th>Data</th>
            <th>Tag</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((s) => {
            const isOpen = expandedRow === s.id;

            return (
              <>
                <tr
                  key={s.id}
                  className="border-b border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <td
                    className="text-center cursor-pointer w-10"
                    onClick={() => setExpandedRow(isOpen ? null : s.id)}
                  >
                    {isOpen ? (
                      <ChevronUp className="inline w-5 h-5" />
                    ) : (
                      <ChevronDown className="inline w-5 h-5" />
                    )}
                  </td>
                  <td className="p-2">{s.id}</td>
                  <td>{s.item?.nome || s.itemId}</td>
                  <td>{s.user?.nome || s.userId}</td>
                  <td className="truncate max-w-[150px]">{s.descricao}</td>
                  <td>{s.localPerda}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="font-semibold">{calcularTag(s.createdAt)}</td>
                  <td className="flex gap-2 p-2">
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
                  </td>
                </tr>

                {isOpen && (
                  <tr className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-300 dark:border-neutral-700">
                    <td colSpan={9}>
                      <div className="p-4 flex flex-col md:flex-row gap-6 items-start">
                        {/* Mostra o carrossel ou imagem simples */}
                        {s.item?.images?.length > 0 ? (
                          <CarrosselImagens imagens={s.item.images} nome={s.item.nome} />
                        ) : s.item?.imagem ? (
                          <div className="overflow-hidden rounded-lg w-48 h-48 group">
                            <img
                              src={`${
                                import.meta.env.VITE_API_URL || "http://localhost:5000"
                              }${
                                s.item.imagem.startsWith("/")
                                  ? s.item.imagem
                                  : "/" + s.item.imagem
                              }`}
                              alt={s.item.nome}
                              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center bg-gray-200 dark:bg-neutral-700 rounded-lg">
                            <span className="text-gray-500 text-sm">Sem imagem</span>
                          </div>
                        )}

                        {/* Dados do item */}
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-lg">{s.item?.nome}</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Descrição:</span> {s.descricao}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Local da perda:</span>{" "}
                            {s.localPerda}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Aluno:</span>{" "}
                            {s.user?.nome || s.userId}
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
