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
        `${import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com"}/solicitacoes?periodo=${periodo}`
      );

      const data = await response.json();
      console.log("📌 Dados recebidos da API:", data); // <-- AQUI
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

    const limpar = (v, f = "Não informado") =>
      v && v !== "" ? v : f;

    const formatarItem = (item) => ({
      "ID": limpar(item.id),
      "Item": limpar(item.itemName),
      "Categoria": limpar(item.category),
      "Status": limpar(traduzirStatus(item.status)),
      "Campus": limpar(item.campusName),
      "Usuário (Criou)": limpar(item.userName),
      "Usuário (Atualizou)": limpar(item.updatedBy?.name || item.updatedBy || "Não informado"),
      "Data de Registro": limpar(formatarData(item.createdAt)),
      "Última Atualização": limpar(formatarData(item.updatedAt)),
    });

    const grupos = {
      "Todos": dados,
      "Achados": dados.filter(d => d.status === "solucionado"),
      "Perdidos": dados.filter(d => d.status === "perdido"),
      "Devolvidos": dados.filter(d => d.status === "devolvido"),
      "Doação": dados.filter(d => d.status === "doacao"),
    };

    const wb = XLSX.utils.book_new();

    for (const nomeAba in grupos) {
      const grupo = grupos[nomeAba].map(formatarItem);

      const header = [
        [
          "ID",
          "Item",
          "Categoria",
          "Status",
          "Campus",
          "Usuário (Criou)",
          "Usuário (Atualizou)",
          "Data de Registro",
          "Última Atualização",
        ],
      ];

      const body = grupo.map((item) => Object.values(item));

      const ws = XLSX.utils.aoa_to_sheet([...header, ...body]);

      // Filtros
      ws["!autofilter"] = { ref: "A1:I1" };

      // Larguras
      ws["!cols"] = [
        { wch: 8 },
        { wch: 30 },
        { wch: 18 },
        { wch: 14 },
        { wch: 20 },
        { wch: 22 },
        { wch: 22 },
        { wch: 18 },
        { wch: 20 },
      ];

      // Estilizar cabeçalho
      const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"];

      headerCells.forEach((cell) => {
        if (!ws[cell]) return;

        ws[cell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      });

      // Bordas do corpo
      const totalLinhas = body.length + 1;

      for (let row = 2; row <= totalLinhas; row++) {
        for (let col of "ABCDEFGHI".split("")) {
          const cell = ws[`${col}${row}`];
          if (!cell) continue;

          cell.s = {
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            }
          };
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, nomeAba);
    }

    XLSX.writeFile(wb, `relatorio_completo_${periodo}.xlsx`);
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
