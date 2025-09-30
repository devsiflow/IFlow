import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  async function fetchSolicitacoes() {
    const { data, error } = await supabase
      .from("solicitacoes")
      .select("id, item_id, aluno_id, status, observacoes, data_solicitacao");
    if (error) console.error(error);
    else setSolicitacoes(data);
  }

  async function updateStatus(id, novoStatus) {
    await supabase.from("solicitacoes").update({ status: novoStatus }).eq("id", id);
    fetchSolicitacoes();
  }

  async function deleteSolicitacao(id) {
    await supabase.from("solicitacoes").delete().eq("id", id);
    fetchSolicitacoes();
  }

  function calcularTag(dataSolicitacao) {
    const dias = Math.floor((new Date() - new Date(dataSolicitacao)) / (1000 * 60 * 60 * 24));
    if (dias > 30) return "Mais de 30 dias";
    if (dias > 15) return "Mais de 15 dias";
    return "Recente";
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
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
            <tr key={s.id} className="border">
              <td>{s.id}</td>
              <td>{s.item_id}</td>
              <td>{s.aluno_id}</td>
              <td>{s.status}</td>
              <td>{new Date(s.data_solicitacao).toLocaleDateString()}</td>
              <td>{calcularTag(s.data_solicitacao)}</td>
              <td className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(s.id, "em análise")}
                >
                  Analisar
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(s.id, "solucionado")}
                >
                  Solucionar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
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

export default AdminPage;
