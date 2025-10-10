export default function TabelaSolicitacoes({ solicitacoes, updateStatus, deleteSolicitacao }) {
  function calcularTag(dataSolicitacao) {
    const dias = Math.floor((new Date() - new Date(dataSolicitacao)) / (1000 * 60 * 60 * 24));
    if (dias >= 90) return "Mais de 90 dias";
    if (dias >= 60) return "Mais de 60 dias";
    if (dias >= 45) return "Mais de 45 dias";
    if (dias >= 30) return "Mais de 30 dias";
    if (dias >= 15) return "Mais de 15 dias";
    return "Recente";
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200 dark:bg-neutral-700">
          <tr>
            <th className="p-2">ID</th>
            <th>Item</th>
            <th>Aluno</th>
            <th>Status</th>
            <th>Data</th>
            <th>Tag</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((s) => (
            <tr key={s.id} className="border-b border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700">
              <td className="p-2">{s.id}</td>
              <td>{s.item_id}</td>
              <td>{s.aluno_id}</td>
              <td>{s.status}</td>
              <td>{new Date(s.data_solicitacao).toLocaleDateString()}</td>
              <td className="font-semibold">{calcularTag(s.data_solicitacao)}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
