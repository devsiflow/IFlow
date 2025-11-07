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
      console.log("🔄 Iniciando carregamento de dados...");
      
      const [itensResponse, solicitacoesResponse] = await Promise.all([
        fetch(`${API_URL}/items`, { credentials: "include" }),
        fetch(`${API_URL}/itemValidation`, { credentials: "include" }),
      ]);

      console.log("📦 Respostas recebidas:", {
        itens: itensResponse.status,
        solicitacoes: solicitacoesResponse.status
      });

      const itensData = await itensResponse.json();
      const solicitacoesData = await solicitacoesResponse.json();

      console.log("📊 Dados recebidos:", {
        itens: itensData.length,
        solicitacoes: solicitacoesData.length
      });

      const items = Array.isArray(itensData) ? itensData : (itensData.items || []);
      const solic = Array.isArray(solicitacoesData) ? solicitacoesData : [];

      setItens(items);
      setSolicitacoes(solic);
      
      processarTotais(items, solic);
      gerarDadosGrafico(items, solic);
      
    } catch (err) {
      console.error("❌ Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  function processarTotais(itensData, solicData) {
    console.log("📈 Processando totais...", {
      totalItens: itensData.length,
      totalSolicitacoes: solicData.length
    });

    let devolvidos = 0;
    let perdidos = 0;
    
    // Contar itens por status
    for (const it of itensData) {
      const status = (it.status || "").toLowerCase();
      if (status.includes("devolvido") || status.includes("encontrado")) {
        devolvidos++;
      } else if (status.includes("perdido")) {
        perdidos++;
      }
    }

    const novosTotais = {
      totalItens: itensData.length,
      devolvidos,
      perdidos,
      pendentesSolicitacoes: solicData.length,
    };

    console.log("🎯 Totais calculados:", novosTotais);
    setTotais(novosTotais);

    // Gerar dados para gráfico de pizza
    const pizzaData = [
      { name: "Devolvidos/Encontrados", value: devolvidos },
      { name: "Perdidos", value: perdidos },
      { name: "Solicitações Pendentes", value: solicData.length },
    ].filter(item => item.value > 0);

    console.log("🍕 Dados pizza:", pizzaData);
    setDadosPizza(pizzaData);
  }

  function gerarDadosGrafico(itensData, solicData) {
    console.log("📊 Gerando dados para gráficos...");
    
    const dadosPorMes = {};
    const meses = [];
    
    // Criar array dos últimos 6 meses
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = data.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric"
      });
      meses.push(mesAno);
      dadosPorMes[mesAno] = { 
        mes: mesAno, 
        itens: 0, 
        itensPerdidos: 0,
        itensDevolvidos: 0,
        solicitacoes: 0 
      };
    }

    console.log("📅 Meses base:", meses);

    // Contar itens por mês e por status
    itensData.forEach(item => {
      if (item.createdAt) {
        const dataItem = new Date(item.createdAt);
        const mesAno = dataItem.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric"
        });
        
        if (dadosPorMes[mesAno]) {
          dadosPorMes[mesAno].itens++;
          
          const status = (item.status || "").toLowerCase();
          if (status.includes("devolvido") || status.includes("encontrado")) {
            dadosPorMes[mesAno].itensDevolvidos++;
          } else if (status.includes("perdido")) {
            dadosPorMes[mesAno].itensPerdidos++;
          }
        }
      }
    });

    // Contar solicitações por mês
    solicData.forEach(solic => {
      if (solic.createdAt) {
        const dataSolic = new Date(solic.createdAt);
        const mesAno = dataSolic.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric"
        });
        
        if (dadosPorMes[mesAno]) {
          dadosPorMes[mesAno].solicitacoes++;
        }
      }
    });

    const linhaData = meses.map(mes => dadosPorMes[mes]);
    
    console.log("📈 Dados linha:", linhaData);
    setDadosLinha(linhaData);
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

  if (!dados || dados.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-2">Distribuição de Status</h3>
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

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
  // Cores consistentes com os cards e gráfico de pizza
  const coresLinhas = {
    itens: "#3B82F6",        // Azul - Total de Itens
    itensDevolvidos: "#16A34A", // Verde - Devolvidos/Encontrados
    itensPerdidos: "#EF4444",   // Vermelho - Perdidos
    solicitacoes: "#EAB308", // Amarelo - Solicitações Pendentes
  };

  if (!dados || dados.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-2">Itens e Solicitações por Mês</h3>
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

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
            <Line 
              type="monotone" 
              dataKey="itens" 
              stroke={coresLinhas.itens} // Azul
              strokeWidth={2} 
              dot={{ r: 4 }} 
              name="Total de Itens" 
            />
            <Line 
              type="monotone" 
              dataKey="itensDevolvidos" 
              stroke={coresLinhas.itensDevolvidos} // Verde
              strokeWidth={2} 
              dot={{ r: 4 }} 
              name="Itens Devolvidos" 
            />
            <Line 
              type="monotone" 
              dataKey="itensPerdidos" 
              stroke={coresLinhas.itensPerdidos} // Vermelho
              strokeWidth={2} 
              dot={{ r: 4 }} 
              name="Itens Perdidos" 
            />
            <Line 
              type="monotone" 
              dataKey="solicitacoes" 
              stroke={coresLinhas.solicitacoes} // Amarelo
              strokeWidth={2} 
              dot={{ r: 4 }} 
              name="Solicitações" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}