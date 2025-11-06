// ✅ src/admin/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";
import TabelaSolicitacoes from "../components/admin/TabelaSolicitacoes";
import TabelaUsuariosAdmin from "../components/admin/TabelaUsuariosAdmin";
import TabelaItensAdmin from "../components/admin/TabelaItensAdmin";
import GeradorRelatorio from "../components/admin/GeradorRelatorio";
import GerenciarSenhasAdmin from "../components/admin/GerenciarSenhasAdmin";
import DashboardAdmin from "../components/admin/DashboardAdmin"; // ✅ IMPORTE AQUI
import LogoLoader from "../components/LogoLoader";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [componenteAtivo, setComponenteAtivo] = useState("dashboard");

  const API_BASE = import.meta.env.VITE_API_URL || "https://iflow-backend.onrender.com";

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
    console.log("🔍 Verificando permissão de admin...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao validar token");

      const data = await res.json();
      console.log("📦 Dados do usuário:", data);

      if (data.isAdmin || data.isSuperAdmin) {
        setUserData(data);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("❌ Erro na verificação de admin:", err);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "solicitacoes", label: "Solicitações", icon: FileText },
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "itens", label: "Itens", icon: Package },
    { id: "relatorios", label: "Relatórios", icon: FileText },
    { id: "senhas", label: "Gerenciar Senhas", icon: Settings },
  ];

  const renderComponente = () => {
    switch (componenteAtivo) {
      case "dashboard":
        return <DashboardAdmin />; // ✅ USE O COMPONENTE AQUI
      case "solicitacoes":
        return <TabelaSolicitacoes 
          solicitacoes={[]} 
          updateStatus={() => {}} 
          deleteSolicitacao={() => {}} 
        />;
      case "usuarios":
        return <TabelaUsuariosAdmin />;
      case "itens":
        return <TabelaItensAdmin />;
      case "relatorios":
        return <GeradorRelatorio />;
      case "senhas":
        return <GerenciarSenhasAdmin />;
      default:
        return <div>Selecione uma opção do menu</div>;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <LogoLoader />;

  if (!isAuthorized)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          Voltar à Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-md z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg transition-all"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all"
            >
              {menuAberto ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo, <span className="font-semibold">{userData?.name}</span>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Menu */}
        <aside className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-800 shadow-lg z-30
          transition-all duration-300 ease-in-out
          ${menuAberto ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-20'}
        `}>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setComponenteAtivo(item.id);
                        if (window.innerWidth < 768) setMenuAberto(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-all
                        ${componenteAtivo === item.id
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className={`
                        transition-opacity duration-200
                        ${menuAberto ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                        ${!menuAberto && 'md:hidden'}
                      `}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {menuAberto && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setMenuAberto(false)}
          />
        )}

        {/* Main Content */}
        <main className={`
          flex-1 transition-all duration-300
          ${menuAberto ? 'md:ml-64' : 'md:ml-20'}
          p-6
        `}>
          <div className="max-w-7xl mx-auto">
            {/* Título da seção atual */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {menuItems.find(item => item.id === componenteAtivo)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {componenteAtivo === 'dashboard' 
                  ? 'Visão geral do sistema e estatísticas' 
                  : `Gerencie ${menuItems.find(item => item.id === componenteAtivo)?.label.toLowerCase() || 'o sistema'}`}
              </p>
            </div>

            {/* Componente renderizado */}
            <div className="animate-fade-in">
              {renderComponente()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}