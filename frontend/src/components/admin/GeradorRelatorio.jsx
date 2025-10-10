import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabaseClient";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

export default function GeradorRelatorio() {
  const [dados, setDados] = useState([]);
  const [periodo, setPeriodo] = useState("2025-10");
  const [grafico, setGrafico] = useState([]);

  useEffect(() => {
    buscarDados();
  }, [periodo]);

  async function buscarDados() {
    const { data } = await supabase
      .from("solicitacoes")
      .select("*")
      .gte("data_solicitacao", `${periodo}-01`)
      .lte("data_solicitacao", `${periodo}-31`);

    setDados(data || []);
    gerarGrafico(data || []);
  }

  function gerarGrafico(data) {
    const contagem = {
      perdidos: data.filter((d) => d.status === "perdido").length,
      achados: data.filter((d) => d.status === "solucionado").length,
      devolvidos: data.filter((d) => d.status === "devolvido").length,
      doacao: data.filter((d) => d.status === "doacao").length,
    };
    setGrafico([
      { name: "Perdidos", value: contagem.perdidos },
      { name: "Achados", value: contagem.achados },
      { name: "Devolvidos", value: contagem.devolvidos },
      { name: "Doação", value: contagem.doacao },
    ]);
  }

  function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, `relatorio_${periodo}.xlsx`);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <input
          type="month"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Exportar Excel
        </button>
      </div>

      <PieChart width={350} height={300}>
        <Pie
          data={grafico}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {grafico.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#f87171", "#60a5fa", "#34d399", "#fbbf24"][index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
