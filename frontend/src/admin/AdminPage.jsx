import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TabelaSolicitacoes from "../components/admin/TabelaSolicitacoes";
import GeradorRelatorio from "../components/admin/GeradorRelatorio";
import RelatorioModal from "../components/admin/RelatorioModal";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import {
  Upload,
  FileText,
  Package,
  BarChart3,
  Lock,
  Users,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import GerenciarSenhasAdmin from "../components/admin/GerenciarSenhasAdmin";
import TabelaUsuariosAdmin from "../components/admin/TabelaUsuariosAdmin";
import TabelaItensAdmin from "../components/admin/TabelaItensAdmin";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);
  const [menuHover, setMenuHover] = useState(false);

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
    await supabase
      .from("solicitacoes")
      .update({ status: novoStatus })
      .eq("id", id);
    fetchSolicitacoes();
  }

  async function deleteSolicitacao(id) {
    await supabase.from("solicitacoes").delete().eq("id", id);
    fetchSolicitacoes();
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white">
      {/* ==== MENU LATERAL ==== */}

     <button className="">

     </button>
      <aside
        className={`transition-all duration-300 bg-white dark:bg-neutral-800 shadow-xl p-4 flex flex-col justify-between ${
          menuHover ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
      >
        <div>
          <h2
            className={`text-2xl font-bold text-center mb-8 text-green-600 dark:text-green-400 transition-opacity duration-300 ${
              menuHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Painel do Administrador
          </h2>

          <nav className="flex flex-col space-y-3">
            <MenuButton
              icon={<ClipboardList size={22} />}
              label="Gerenciar Itens"
              active={activeTab === "gerenciarItens"}
              expanded={menuHover}
              onClick={() => setActiveTab("gerenciarItens")}
            />

            <MenuButton
              icon={<Users size={22} />}
              label="Gerenciar Usuários"
              active={activeTab === "gerenciarUsuarios"}
              expanded={menuHover}
              onClick={() => setActiveTab("gerenciarUsuarios")}
            />

            <MenuButton
              icon={<Lock size={22} />}
              label="Gerenciar Senhas"
              active={activeTab === "gerenciarSenhas"}
              expanded={menuHover}
              onClick={() => setActiveTab("gerenciarSenhas")}
            />

            <MenuButton
              icon={<LayoutDashboard size={22} />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              expanded={menuHover}
              onClick={() => setActiveTab("dashboard")}
            />

            <MenuButton
              icon={<Package size={22} />}
              label="Solicitações"
              active={activeTab === "solicitacoes"}
              expanded={menuHover}
              onClick={() => setActiveTab("solicitacoes")}
            />

            <MenuButton
              icon={<BarChart3 size={22} />}
              label="Gerar Relatório"
              active={activeTab === "relatorio"}
              expanded={menuHover}
              onClick={() => setActiveTab("relatorio")}
            />

            <MenuButton
              icon={<Upload size={22} />}
              label="Ver Relatórios"
              active={activeTab === "verRelatorio"}
              expanded={menuHover}
              onClick={() => setActiveTab("verRelatorio")}
            />
          </nav>
        </div>

        <footer
          className={`text-xs text-gray-500 dark:text-gray-400 text-center transition-opacity duration-300 ${
            menuHover ? "opacity-100" : "opacity-0"
          }`}
        >
          © {new Date().getFullYear()} IFLOW Admin
        </footer>
      </aside>

      {/* ==== CONTEÚDO PRINCIPAL ==== */}
      <main className="flex-1 p-8 overflow-y-auto">
         <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-md"
          >
            Voltar ao Início
          </button>
        {activeTab === "dashboard" && <DashboardAdmin />}

        {activeTab === "solicitacoes" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Solicitações de Itens</h1>
            </header>
            <TabelaSolicitacoes
              solicitacoes={solicitacoes}
              updateStatus={updateStatus}
              deleteSolicitacao={deleteSolicitacao}
            />
          </>
        )}

        {activeTab === "relatorio" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Gerar Relatório</h1>
              <button
                onClick={() => setMostrarRelatorio(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all"
              >
                <FileText className="inline mr-2" size={18} />
                Gerar Relatório
              </button>
            </header>

            {mostrarRelatorio && (
              <RelatorioModal onClose={() => setMostrarRelatorio(false)}>
                <GeradorRelatorio />
              </RelatorioModal>
            )}
          </>
        )}

        {activeTab === "verRelatorio" && (
          <section className="mt-6">
            <h1 className="text-3xl font-bold mb-4">Ver Relatório Exportado</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Faça upload de um arquivo Excel (.xlsx) exportado anteriormente
              para visualizar os dados.
            </p>
            <input
              type="file"
              accept=".xlsx"
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-neutral-800"
            />
          </section>
        )}

        {activeTab === "gerenciarItens" && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Gerenciar Itens</h1>
            <p className="text-gray-500 mb-4">
              Aqui o administrador pode visualizar, editar e excluir qualquer
              item do sistema.
            </p>
            {/* 🔧 Substitua pelo seu componente de gerenciamento de itens */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 text-center text-gray-500">
              <TabelaItensAdmin />
            </div>
          </section>
        )}

        {activeTab === "gerenciarUsuarios" && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>
            <p className="text-gray-500 mb-4">
              O administrador pode listar, editar e remover qualquer usuário do
              sistema.
            </p>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 text-center text-gray-500">
              <TabelaUsuariosAdmin />
            </div>
          </section>
        )}

        {activeTab === "gerenciarSenhas" && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Gerenciar Senhas</h1>
            <p className="text-gray-500 mb-4">
              Permite redefinir ou alterar a senha de qualquer usuário
              cadastrado.
            </p>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 text-center text-gray-500">
              <GerenciarSenhasAdmin />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ==== COMPONENTE BOTÃO DO MENU ==== */
function MenuButton({ icon, label, active, expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all duration-200 ${
        active
          ? "bg-green-500 text-white"
          : "hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200"
      }`}
    >
      {icon}
      {expanded && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}