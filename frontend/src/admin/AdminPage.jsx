import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TabelaSolicitacoes from "../components/admin/TabelaSolicitacoes";
import GeradorRelatorio from "../components/admin/GeradorRelatorio";
import RelatorioModal from "../components/admin/RelatorioModal";


export default function AdminPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen dark:bg-neutral-900 text-gray-900 dark:text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo - IFLOW</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarRelatorio(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            📊 Gerar Relatório
          </button>
        </div>
      </header>

      <TabelaSolicitacoes
        solicitacoes={solicitacoes}
        updateStatus={updateStatus}
        deleteSolicitacao={deleteSolicitacao}
      />

      {mostrarRelatorio && (
        <RelatorioModal onClose={() => setMostrarRelatorio(false)}>
          <GeradorRelatorio />
        </RelatorioModal>
      )}
    </div>
  );
}
