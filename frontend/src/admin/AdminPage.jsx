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
  ArrowLeft,
  Shield,
  Building,
  Key,
  BarChart3
} from "lucide-react";

import TabelaSolicitacoes from "../components/admin/TabelaSolicitacoes";
import TabelaUsuariosAdmin from "../components/admin/TabelaUsuariosAdmin";
import TabelaItensAdmin from "../components/admin/TabelaItensAdmin";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import LogoLoader from "../components/LogoLoader";
import ManageAdmins from "../components/admin/ManageAdmins";
import ManageCampus from "../components/admin/ManageCampus";
// import GeradorRelatorio from "../components/admin/GeradorRelatorio";
// import GerenciarSenhas from "../components/admin/GerenciarSenhas";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [componenteAtivo, setComponenteAtivo] = useState("dashboard");
  const [solicitacoes, setSolicitacoes] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || "https://iflow-backend.onrender.com";

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
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

  async function carregarSolicitacoes() {
    try {
      const res = await fetch(`${API_BASE}/itemValidation`);
      if (!res.ok) throw new Error("Erro ao buscar solicitações");
      const data = await res.json();
      setSolicitacoes(data);
    } catch (error) {
      console.error("❌ Erro ao carregar solicitações:", error);
    }
  }

  useEffect(() => {
    if (componenteAtivo === "solicitacoes") {
      carregarSolicitacoes();
    }
  }, [componenteAtivo]);

  async function updateStatus(id, novoStatus) {
    try {
      const res = await fetch(`${API_BASE}/itemValidation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      carregarSolicitacoes();
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
    }
  }

  async function deleteSolicitacao(id) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.text();
        alert("Erro ao excluir: " + error);
        return;
      }

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      alert("Solicitação excluída com sucesso!");
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  // 🔥 MENU COMPLETO - TODAS AS FUNÇÕES ORIGINAIS + NOVAS
  const baseMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "solicitacoes", label: "Solicitações", icon: FileText },
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "itens", label: "Itens", icon: Package },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
    { id: "senhas", label: "Gerenciar Senhas", icon: Key },
  ];

  // 🔥 FUNÇÕES EXTRAS APENAS PARA SUPERADMIN
  const superAdminMenuItems = [
    { id: "gerenciar-admins", label: "Gerenciar Admins", icon: Shield },
    { id: "gerenciar-campus", label: "Gerenciar Campus", icon: Building },
  ];

  // 🔥 COMBINAR MENUS - SuperAdmin vê tudo, Admin normal vê só o básico
  const menuItems = userData?.isSuperAdmin 
    ? [...baseMenuItems, ...superAdminMenuItems]
    : baseMenuItems;

  const renderComponente = () => {
    switch (componenteAtivo) {
      case "dashboard":
        return <DashboardAdmin />;
      case "solicitacoes":
        return (
          <TabelaSolicitacoes
            solicitacoes={solicitacoes}
            updateStatus={updateStatus}
            deleteSolicitacao={deleteSolicitacao}
          />
        );
      case "usuarios":
        return <TabelaUsuariosAdmin />;
      case "itens":
        return <TabelaItensAdmin />;
      case "relatorios":
        return <GeradorRelatorio />;
      case "senhas":
        return <GerenciarSenhas />;
      case "gerenciar-admins":
        return <ManageAdmins />;
      case "gerenciar-campus":
        return <ManageCampus />;
      default:
        return <div>Selecione uma opção do menu</div>;
    }
  };

  if (loading) return <LogoLoader />;

  if (!isAuthorized)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="mb-6">Você não tem permissão para acessar esta página.</p>
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
              onClick={() => navigate(-1)}
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
            {userData?.isSuperAdmin && (
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                SuperAdmin
              </span>
            )}
            {userData?.isAdmin && !userData?.isSuperAdmin && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                Admin
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo, <span className="font-semibold">{userData?.name}</span>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-800 shadow-lg z-30 transition-all duration-300 ease-in-out ${
            menuAberto
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full md:translate-x-0 md:w-20"
          }`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isSuperAdminItem = superAdminMenuItems.some(superItem => superItem.id === item.id);
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setComponenteAtivo(item.id);
                        if (window.innerWidth < 768) setMenuAberto(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        componenteAtivo === item.id
                          ? isSuperAdminItem
                            ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                            : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Icon size={20} />
                      <span
                        className={`transition-opacity duration-200 ${
                          menuAberto
                            ? "opacity-100"
                            : "opacity-0 md:opacity-100"
                        } ${!menuAberto && "md:hidden"}`}
                      >
                        {item.label}
                      </span>
                      {isSuperAdminItem && (
                        <span className="ml-auto text-xs text-purple-500 font-semibold">
                          SUPER
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Conteúdo */}
        <main
          className={`flex-1 transition-all duration-300 ${ 
            menuAberto ? "md:ml-64" : "md:ml-20"
          } p-6`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {menuItems.find((item) => item.id === componenteAtivo)?.label ||
                  "Dashboard"}
              </h2>
              {superAdminMenuItems.some(item => item.id === componenteAtivo) && (
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  ⚡ Funcionalidade exclusiva para SuperAdmin
                </p>
              )}
            </div>
            <div className="animate-fade-in">{renderComponente()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}