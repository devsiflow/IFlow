import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip as ReTooltip,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DashboardAdmin() {
    console.log("📊 DashboardAdmin MONTADO");
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [graficoAberto, setGraficoAberto] = useState(null);

  const [totais, setTotais] = useState({
    totalItens: 0,
    encontrados: 0,
    devolvidos: 0,
    perdidos: 0,
    pendentesSolicitacoes: 0,
  });

  const [dadosPizza, setDadosPizza] = useState([]);
  const [dadosLinha, setDadosLinha] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [itensResponse, solicitacoesResponse] = await Promise.all([
        fetch(`${API_URL}/items?admin=true`, { credentials: "include" }),
        fetch(`${API_URL}/itemValidation`, { credentials: "include" }),
      ]);

      const itensData = await itensResponse.json();
      const solicitacoesData = await solicitacoesResponse.json();

      const items = Array.isArray(itensData.items)
        ? itensData.items
        : Array.isArray(itensData)
          ? itensData
          : [];

      const solic = Array.isArray(solicitacoesData)
        ? solicitacoesData
        : [];

      setItens(items);
      setSolicitacoes(solic);

      processarTotais(items, solic);
      gerarDadosGrafico(items, solic);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  function processarTotais(itensData, solicData) {
    let encontrados = 0;
    let devolvidos = 0;
    let perdidos = 0;

    for (const it of itensData) {
      const status = (it.status || "").toLowerCase();

      if (status === "encontrado") encontrados++;
      else if (status === "devolvido") devolvidos++;
      else if (status === "perdido") perdidos++;
    }

    const novosTotais = {
      totalItens: itensData.length,
      encontrados,
      devolvidos,
      perdidos,
      pendentesSolicitacoes: solicData.length,
    };

    setTotais(novosTotais);

    const pizzaData = [
      { name: "Encontrados", value: encontrados },
      { name: "Devolvidos", value: devolvidos },
      { name: "Perdidos", value: perdidos },
      { name: "Solicitações Pendentes", value: solicData.length },
    ].filter((item) => item.value > 0);

    setDadosPizza(pizzaData);
  }

  function gerarDadosGrafico(itensData, solicData) {
    const dadosPorMes = {};
    const meses = [];

    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = data.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      meses.push(mesAno);
      dadosPorMes[mesAno] = {
        mes: mesAno,
        encontrados: 0,
        devolvidos: 0,
        perdidos: 0,
        solicitacoes: 0,
      };
    }

    itensData.forEach((item) => {
      if (item.createdAt) {
        const dataItem = new Date(item.createdAt);
        const mesAno = dataItem.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });

        if (dadosPorMes[mesAno]) {
          const status = (item.status || "").toLowerCase();

          if (status === "encontrado") dadosPorMes[mesAno].encontrados++;
          else if (status === "devolvido") dadosPorMes[mesAno].devolvidos++;
          else if (status === "perdido") dadosPorMes[mesAno].perdidos++;
        }
      }
    });

    solicData.forEach((solic) => {
      if (solic.createdAt) {
        const dataSolic = new Date(solic.createdAt);
        const mesAno = dataSolic.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });

        if (dadosPorMes[mesAno]) {
          dadosPorMes[mesAno].solicitacoes++;
        }
      }
    });

    setDadosLinha(meses.map((mes) => dadosPorMes[mes]));
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <ResumoCard title="Total de Itens" value={totais.totalItens} color="bg-gray-700" />

            <ResumoCard title="Encontrados" value={totais.encontrados} color="bg-blue-600" />
            <ResumoCard title="Devolvidos" value={totais.devolvidos} color="bg-green-600" />
            <ResumoCard title="Perdidos" value={totais.perdidos} color="bg-red-600" />
            <ResumoCard title="Solicitações Pendentes" value={totais.pendentesSolicitacoes} color="bg-yellow-500" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div onClick={() => setGraficoAberto("pizza")} className="cursor-pointer hover:scale-[1.02] transition-transform">
              <GraficoPizza dados={dadosPizza} />
            </div>

            <div onClick={() => setGraficoAberto("linha")} className="cursor-pointer hover:scale-[1.02] transition-transform">
              <GraficoLinha dados={dadosLinha} />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={carregarDados}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Atualizar Dados
            </button>
          </div>
        </>
      )}

      {graficoAberto && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setGraficoAberto(null)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-[90%] max-w-4xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGraficoAberto(null)}
              className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              {graficoAberto === "pizza" ? "Distribuição de Status" : "Itens e Solicitações por Mês"}
            </h3>

            <div className="w-full h-[450px]">
              {graficoAberto === "pizza" && <GraficoPizza dados={dadosPizza} />}
              {graficoAberto === "linha" && <GraficoLinha dados={dadosLinha} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==== COMPONENTES AUX ==== */
function ResumoCard({ title, value, color = "bg-gray-600" }) {
  return (
    <div className={`p-4 rounded-2xl shadow flex flex-col justify-between ${color} text-white`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

function GraficoPizza({ dados }) {
  const getCorCategoria = (nome) => {
    switch (nome) {
      case "Encontrados":
        return "#3B82F6";
      case "Devolvidos":
        return "#16A34A";
      case "Perdidos":
        return "#EF4444";
      case "Solicitações Pendentes":
        return "#EAB308";
      default:
        return "#60A5FA";
    }
  };

  return (
    <div className="bg:white dark:bg-neutral-800 rounded-2xl shadow p-4 bg-white">
      <h3 className="font-semibold mb-2">Distribuição de Status</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={dados}
              nameKey="name"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {dados.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={getCorCategoria(entry.name)} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GraficoLinha({ dados }) {
  const cores = {
    encontrados: "#3B82F6",
    devolvidos: "#16A34A",
    perdidos: "#EF4444",
    solicitacoes: "#EAB308",
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
      <h3 className="font-semibold mb-2">Itens e Solicitações por Mês</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="encontrados" stroke={cores.encontrados} name="Encontrados" />
            <Line type="monotone" dataKey="devolvidos" stroke={cores.devolvidos} name="Devolvidos" />
            <Line type="monotone" dataKey="perdidos" stroke={cores.perdidos} name="Perdidos" />
            <Line type="monotone" dataKey="solicitacoes" stroke={cores.solicitacoes} name="Solicitações" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
