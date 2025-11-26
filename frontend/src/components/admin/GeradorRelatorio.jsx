import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

export default function GeradorRelatorio() {
  const [dados, setDados] = useState([]);
  const [periodo, setPeriodo] = useState("2025-10");
  const [grafico, setGrafico] = useState([]);

  useEffect(() => {
    buscarDados();
  }, [periodo]);

  async function buscarDados() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com"}/dashboard/solicitacoes?periodo=${periodo}`
      );

      const data = await response.json();
      setDados(data || []);
      gerarGrafico(data || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }

  function traduzirStatus(status) {
    const map = {
      perdido: "Perdido",
      solucionado: "Achado",
      devolvido: "Devolvido",
      doacao: "Doação",
    };
    return map[status] || status;
  }

  function formatarData(dataStr) {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
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

  // 🔥 NOVA FUNÇÃO — Excel organizado
  function exportarExcel() {
    if (!dados.length) return alert("Nenhum dado para exportar.");

    // organiza colunas
    const planilha = dados.map((item) => ({
      ID: item.id,
      Item: item.itemName || "—",
      Categoria: item.category || "—",
      Status: traduzirStatus(item.status),
      "Data de Registro": formatarData(item.createdAt),
      "Última Atualização": formatarData(item.updatedAt),
      Usuário: item.userName || "—",
      Campus: item.campusName || "—",
    }));

    // cria worksheet
    const ws = XLSX.utils.json_to_sheet(planilha);

    // ajusta largura das colunas
    ws["!cols"] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 18 },
      { wch: 22 },
      { wch: 20 },
    ];

    // cria arquivo excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");

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
          {grafico.map((_, i) => (
            <Cell
              key={i}
              fill={["#f87171", "#60a5fa", "#34d399", "#fbbf24"][i]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
