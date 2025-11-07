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

const COLORS = ["#16A34A", "#EF4444", "#84CC16", "#22C55E", "#60A5FA"];
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [totais, setTotais] = useState({
    totalItens: 0,
    devolvidos: 0,
    perdidos: 0,
    pendentesSolicitacoes:0,
  });

  const [dadosPizza, setDadosPizza] = useState([]);
  const [dadosLinha, setDadosLinha] = useState([]); // [{mes, itens, solicitacoes}...]

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [itensResponse, dashboardResponse] = await Promise.all([
        fetch(`${API_URL}/items?pageSize=1000`, { credentials: "include" }),
        fetch(`${API_URL}/dashboard`, { credentials: "include" }),
      ]);

      if (!itensResponse.ok || !dashboardResponse.ok) {
        console.warn("⚠️ Erro na resposta das APIs:", itensResponse.status, dashboardResponse.status);
      }

      const itensData = await itensResponse.json().catch(() => ({ items: [] }));
      const dashboardData = await dashboardResponse.json().catch(() => ({}));

      const items = itensData.items || [];
      const solicitacoesData = [];

      setItens(items);
      setSolicitacoes(solicitacoesData);
      processarTotais(items, solicitacoesData);
      gerarDadosGrafico(items, solicitacoesData, dashboardData);
    } catch (err) {
      console.error("❌ Erro ao carregar dashboard:", err);
      carregarDadosFallback();
    } finally {
      setLoading(false);
    }
  }

  async function carregarDadosFallback() {
    try {
      const response = await fetch(`${API_URL}/dashboard`, { credentials: "include" });
      if (!response.ok) throw new Error("Falha ao buscar dados do dashboard");
      const data = await response.json();

      setTotais({
        totalItens: data.totalItens || 0,
        devolvidos: data.itensPorStatus?.find(i => i.status === "devolvido")?._count?.status || 0,
        perdidos: data.itensPorStatus?.find(i => i.status === "perdido")?._count?.status || 0,
        pendentesSolicitacoes: 0,
      });

      if (data.itensPorStatus) {
        setDadosPizza(
          data.itensPorStatus.map(item => ({
            name: item.status === "devolvido" ? "Devolvidos/Encontrados" : 
                  item.status === "perdido" ? "Perdidos" : "Solicitações Pendentes",
            value: item._count.status,
          }))
        );
      }

      if (data.itensPorMes) {
        const linhaData = Object.entries(data.itensPorMes).map(([mes, quantidade]) => ({
          mes,
          itens: quantidade,
          solicitacoes: 0,
        }));
        setDadosLinha(linhaData);
      }
    } catch (err) {
      console.error("Erro no fallback:", err);
    }
  }

  function processarTotais(itensData, solicData) {
    let devolvidos = 0;
    let perdidos = 0;
    for (const it of itensData) {
      const st = it.status ? String(it.status).toLowerCase() : "";
      if (st.includes("devol") || st.includes("encontrado")) devolvidos++;
      else if (st.includes("perd")) perdidos++;
    }

    const pendentesSolic = solicData.filter(s =>
      (s.status || "").toLowerCase().includes("pend")
    ).length;

    setTotais({
      totalItens: itensData.length,
      devolvidos,
      perdidos,
      pendentesSolicitacoes: pendentesSolic,
    });

    setDadosPizza([
      { name: "Devolvidos/Encontrados", value: devolvidos },
      { name: "Perdidos", value: perdidos },
      { name: "Solicitações Pendentes", value: Math.max(0, itensData.length - devolvidos - perdidos) },
    ]);
  }

  function gerarDadosGrafico(itensData, solicData, dashboardData) {
    if (dashboardData.itensPorMes) {
      const arr = Object.entries(dashboardData.itensPorMes).map(([mes, quantidade]) => ({
        mes,
        itens: quantidade,
        solicitacoes: 0,
      }));
      setDadosLinha(arr);
      return;
    }

    const map = {};
    const mkkey = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return null;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };

    for (const it of itensData) {
      const key = mkkey(it.createdAt);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].itens++;
    }

    for (const s of solicData) {
      const key = mkkey(s.createdAt);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].solicitacoes++;
    }

    const arr = Object.keys(map)
      .sort()
      .map(k => {
        const [y, m] = k.split("-");
        const mesLabel = new Date(y, m - 1).toLocaleString("pt-BR", { month: "short", year: "numeric" });
        return { mes: mesLabel, ...map[k] };
      });

    setDadosLinha(arr.length ? arr : gerarPlaceholder());
  }

  function gerarPlaceholder() {
    const placeholder = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      placeholder.push({
        mes: d.toLocaleString("pt-BR", { month: "short", year: "numeric" }),
        itens: 0,
        solicitacoes: 0,
      });
    }
    return placeholder;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ResumoCard title="Total de Itens" value={totais.totalItens} color="bg-green-600" />
        <ResumoCard title="Devolvidos/Encontrados" value={totais.devolvidos} color="bg-green-500" />
        <ResumoCard title="Perdidos" value={totais.perdidos} color="bg-red-500" />
        <ResumoCard title="Solicitações Pendentes" value={totais.pendentesSolicitacoes} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoPizza dados={dadosPizza} />
        <GraficoLinha dados={dadosLinha} />
      </div>

      {loading && <p className="text-sm text-gray-500 mt-4">Carregando dados...</p>}

      <div className="mt-6 text-center">
        <button
          onClick={carregarDados}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Atualizar Dados
        </button>
      </div>
    </div>
  );
}

/* ==== COMPONENTES AUX ==== */
function ResumoCard({ title, value, color = "bg-gray-600" }) {
  return (
    <div className={`p-4 rounded-2xl shadow flex flex-col justify-between ${color} text-white`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold mt-2">{typeof value === "number" ? value : String(value)}</div>
    </div>
  );
}

function GraficoPizza({ dados }) {
  // Cores específicas para cada categoria
  const getColorPorCategoria = (nome) => {
    switch (nome) {
      case "Devolvidos/Encontrados":
        return "#16A34A"; // Verde
      case "Perdidos":
        return "#EF4444"; // Vermelho
      case "Solicitações Pendentes":
        return "#EAB308"; // Amarelo
      default:
        return "#60A5FA"; // Azul padrão
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
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
                <Cell key={`cell-${idx}`} fill={getColorPorCategoria(entry.name)} />
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
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
      <h3 className="font-semibold mb-2">Itens e Solicitações por Mês</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={dados} margin={{ top: 10, right: 12, left: -6, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="itens" stroke="#16A34A" strokeWidth={2} dot={{ r: 4 }} name="Itens" />
            <Line type="monotone" dataKey="solicitacoes" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} name="Solicitações" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}