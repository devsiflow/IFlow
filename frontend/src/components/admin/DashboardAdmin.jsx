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

const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#EF4444", "#60A5FA"];

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
      // tenta várias variações comuns de tabela para items
      const itemTables = ["itens", "items", "item", "Itens"];
      let itensData = null;
      for (const t of itemTables) {
        const { data, error } = await supabase.from(t).select("*");
        if (!error) {
          itensData = data || [];
          break;
        }
      }
      if (itensData === null) {
        console.warn("Tabela de itens não encontrada nas variações esperadas.");
        itensData = [];
      }

      // solicitações (usuário já usava "solicitacoes")
      const solicitacoesTables = ["solicitacoes", "solicitations", "solicitacao"];
      let solicitacoesData = null;
      for (const t of solicitacoesTables) {
        const { data, error } = await supabase.from(t).select("*");
        if (!error) {
          solicitacoesData = data || [];
          break;
        }
      }
      if (solicitacoesData === null) {
        console.warn("Tabela de solicitacoes não encontrada nas variações esperadas.");
        solicitacoesData = [];
      }

      setItens(itensData);
      setSolicitacoes(solicitacoesData);

      processarTotais(itensData, solicitacoesData);
      gerarDadosGrafico(itensData, solicitacoesData);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  function processarTotais(itensData, solicData) {
    // adaptações: detecta campos de status em diversas convenções
    const statusFieldCandidates = ["status", "estado", "situacao"];
    const createdAtCandidates = ["criado_em", "created_at", "createdAt", "data_criacao", "data_solicitacao"];

    const detectField = (obj, candidates) => {
      for (const c of candidates) if (Object.prototype.hasOwnProperty.call(obj, c)) return c;
      return null;
    };

    const statusField = itensData.length ? detectField(itensData[0], statusFieldCandidates) : "status";
    const itemDateField = itensData.length ? detectField(itensData[0], createdAtCandidates) : null;
    const solicDateField = solicData.length ? detectField(solicData[0], createdAtCandidates.concat(["data_solicitacao"])) : null;
    const solicStatusField = solicData.length ? detectField(solicData[0], statusFieldCandidates) : "status";

    // contagens para itens
    let devolvidos = 0;
    let perdidos = 0;
    for (const it of itensData) {
      const st = (statusField && it[statusField]) ? String(it[statusField]).toLowerCase() : "";
      if (st.includes("devol") || st.includes("solucionad") || st.includes("returned")) devolvidos++;
      else if (st.includes("perd") || st.includes("lost")) perdidos++;
      // outros estados podem existir; você pode adaptar aqui
    }

    // contagem de solicitações pendentes
    let pendentesSolic = 0;
    for (const s of solicData) {
      const st = (solicStatusField && s[solicStatusField]) ? String(s[solicStatusField]).toLowerCase() : "";
      if (st.includes("pend") || st.includes("pending")) pendentesSolic++;
    }

    setTotais({
      totalItens: itensData.length,
      devolvidos,
      perdidos,
      pendentesSolicitacoes: pendentesSolic,
    });

    // dados para pizza
    setDadosPizza([
      { name: "Devolvidos", value: devolvidos },
      { name: "Perdidos", value: perdidos },
      { name: "Outros", value: Math.max(0, itensData.length - devolvidos - perdidos) },
    ]);
  }

  function gerarDadosGrafico(itensData, solicData) {
    // cria um mapa mês->{itens, solicitacoes}
    const map = {}; // key "YYYY-MM"
    const mkkey = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return null;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    };

    // detect date fields heuristically
    const itemDateCandidates = ["criado_em", "created_at", "createdAt", "data_criacao", "data_registro", "data"];
    const solicDateCandidates = ["data_solicitacao", "created_at", "createdAt", "data"];
    const detectField = (arr, candidates) => {
      if (!arr.length) return null;
      const obj = arr[0];
      for (const c of candidates) if (Object.prototype.hasOwnProperty.call(obj, c)) return c;
      return null;
    };
    const itemDateField = detectField(itensData, itemDateCandidates);
    const solicDateField = detectField(solicData, solicDateCandidates);

    // acumula itens
    for (const it of itensData) {
      const key = mkkey(itemDateField ? it[itemDateField] : it.created_at || it.createdAt || it.data);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].itens++;
    }

    // acumula solicitacoes
    for (const s of solicData) {
      const key = mkkey(solicDateField ? s[solicDateField] : s.data_solicitacao || s.created_at || s.createdAt || s.data);
      if (!key) continue;
      if (!map[key]) map[key] = { mes: key, itens: 0, solicitacoes: 0 };
      map[key].solicitacoes++;
    }

    // ordenar por chave e transformar para array legível (label de mês mais amigável)
    const keys = Object.keys(map).sort();
    const arr = keys.map((k) => {
      const [y, m] = k.split("-");
      const date = new Date(Number(y), Number(m) - 1, 1);
      const mesLabel = date.toLocaleString("pt-BR", { month: "short", year: "numeric" });
      return { mes: mesLabel, itens: map[k].itens, solicitacoes: map[k].solicitacoes };
    });

    // se não houver dados, cria um placeholder com último 6 meses (zeros)
    if (!arr.length) {
      const placeholder = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        placeholder.push({ mes: d.toLocaleString("pt-BR", { month: "short", year: "numeric" }), itens: 0, solicitacoes: 0 });
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
        <ResumoCard title="Total de Itens" value={totais.totalItens} color="bg-indigo-600" />
        <ResumoCard title="Devolvidos" value={totais.devolvidos} color="bg-green-500" />
        <ResumoCard title="Perdidos" value={totais.perdidos} color="bg-red-500" />
        <ResumoCard title="Solicitações pendentes" value={totais.pendentesSolicitacoes} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-2">Distribuição de Status</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={dadosPizza} nameKey="name" outerRadius={100} label>
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
              <LineChart data={dadosLinha} margin={{ top: 10, right: 12, left: -6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="itens" stroke="#4F46E5" strokeWidth={2} dot />
                <Line type="monotone" dataKey="solicitacoes" stroke="#22C55E" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500 mt-4">Carregando dados...</p>}
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
