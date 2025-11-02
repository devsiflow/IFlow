// components/admin/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
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

const COLORS = ["#16A34A", "#22C55E", "#84CC16", "#EF4444", "#60A5FA"];

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [totais, setTotais] = useState({
    totalItens: 0,
    devolvidos: 0,
    perdidos: 0,
    pendentesSolicitacoes: 0,
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
      // Buscar dados do backend em vez do Supabase diretamente
      const [itensResponse, solicitacoesResponse, dashboardResponse] = await Promise.all([
        fetch("/items?pageSize=1000").then(res => res.ok ? res.json() : { items: [] }),
        fetch("/dashboard").then(res => res.ok ? res.json() : {}),
        fetch("/dashboard").then(res => res.ok ? res.json() : {})
      ]);

      const itensData = itensResponse.items || [];
      const dashboardData = dashboardResponse || {};
      
      // Para solicitações, vamos usar os dados do dashboard ou simular
      let solicitacoesData = [];
      
      setItens(itensData);
      setSolicitacoes(solicitacoesData);

      processarTotais(itensData, solicitacoesData);
      gerarDadosGrafico(itensData, solicitacoesData, dashboardData);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      // Fallback: tentar carregar dados básicos
      carregarDadosFallback();
    } finally {
      setLoading(false);
    }
  }

  async function carregarDadosFallback() {
    try {
      // Tentar buscar dados básicos do endpoint /dashboard
      const response = await fetch("/dashboard");
      if (response.ok) {
        const data = await response.json();
        
        setTotais({
          totalItens: data.totalItens || 0,
          totalUsuarios: data.totalUsuarios || 0,
          devolvidos: data.itensPorStatus?.find(item => item.status === 'devolvido')?._count?.status || 0,
          perdidos: data.itensPorStatus?.find(item => item.status === 'perdido')?._count?.status || 0,
          pendentesSolicitacoes: 0 // Não temos esse dado no dashboard atual
        });

        // Processar dados para gráficos
        if (data.itensPorStatus) {
          setDadosPizza(
            data.itensPorStatus.map(item => ({
              name: item.status,
              value: item._count.status
            }))
          );
        }

        if (data.itensPorMes) {
          const linhaData = Object.entries(data.itensPorMes).map(([mes, quantidade]) => ({
            mes,
            itens: quantidade,
            solicitacoes: 0 // Não temos dados de solicitações por mês
          }));
          setDadosLinha(linhaData);
        }
      }
    } catch (err) {
      console.error("Erro no fallback:", err);
    }
  }

  function processarTotais(itensData, solicData) {
    // Contagens para itens
    let devolvidos = 0;
    let perdidos = 0;
    for (const it of itensData) {
      const st = it.status ? String(it.status).toLowerCase() : "";
      if (st.includes("devol") || st.includes("solucionad") || st.includes("returned") || st.includes("encontrado")) devolvidos++;
      else if (st.includes("perd") || st.includes("lost")) perdidos++;
    }

    // Contagem de solicitações pendentes (usando dados mock por enquanto)
    let pendentesSolic = solicData.filter(s => {
      const st = s.status ? String(s.status).toLowerCase() : "";
      return st.includes("pend") || st.includes("pending") || st.includes("em análise");
    }).length;

    setTotais({
      totalItens: itensData.length,
      devolvidos,
      perdidos,
      pendentesSolicitacoes: pendentesSolic,
    });

    // Dados para pizza
    setDadosPizza([
      { name: "Devolvidos/Encontrados", value: devolvidos },
      { name: "Perdidos", value: perdidos },
      { name: "Outros", value: Math.max(0, itensData.length - devolvidos - perdidos) },
    ]);
  }

  function gerarDadosGrafico(itensData, solicData, dashboardData) {
    // Se temos dados do dashboard, usá-los
    if (dashboardData.itensPorMes) {
      const arr = Object.entries(dashboardData.itensPorMes).map(([mes, quantidade]) => ({
        mes,
        itens: quantidade,
        solicitacoes: 0 // Não temos esse dado ainda
      }));
      setDadosLinha(arr);
      return;
    }

    // Fallback: criar mapa mês->{itens, solicitacoes}
    const map = {}; // key "YYYY-MM"
    const mkkey = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return null;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    };

    // Acumula itens
    for (const it of itensData) {
      const key = mkkey(it.createdAt);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].itens++;
    }

    // Acumula solicitacoes
    for (const s of solicData) {
      const key = mkkey(s.data_solicitacao || s.created_at || s.createdAt || s.data);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].solicitacoes++;
    }

    // Ordenar por chave e transformar para array legável
    const keys = Object.keys(map).sort();
    const arr = keys.map((k) => {
      const [y, m] = k.split("-");
      const date = new Date(Number(y), Number(m) - 1, 1);
      const mesLabel = date.toLocaleString("pt-BR", { month: "short", year: "numeric" });
      return { mes: mesLabel, itens: map[k].itens, solicitacoes: map[k].solicitacoes };
    });

    // Se não houver dados, cria um placeholder com último 6 meses (zeros)
    if (!arr.length) {
      const placeholder = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        placeholder.push({ 
          mes: d.toLocaleString("pt-BR", { month: "short", year: "numeric" }), 
          itens: 0, 
          solicitacoes: 0 
        });
      }
      setDadosLinha(placeholder);
    } else {
      setDadosLinha(arr);
    }
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ResumoCard title="Total de Itens" value={totais.totalItens} color="bg-green-600" />
        <ResumoCard title="Devolvidos/Encontrados" value={totais.devolvidos} color="bg-green-500" />
        <ResumoCard title="Perdidos" value={totais.perdidos} color="bg-red-500" />
        <ResumoCard title="Solicitações pendentes" value={totais.pendentesSolicitacoes} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-2">Distribuição de Status</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  dataKey="value" 
                  data={dadosPizza} 
                  nameKey="name" 
                  outerRadius={100} 
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dadosPizza.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-2">Itens e Solicitações por Mês</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart 
                data={dadosLinha} 
                margin={{ top: 10, right: 12, left: -6, bottom: 6 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="itens" 
                  stroke="#16A34A" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Itens"
                />
                <Line 
                  type="monotone" 
                  dataKey="solicitacoes" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Solicitações"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500 mt-4">Carregando dados...</p>}
      
      {/* Botão para recarregar dados */}
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