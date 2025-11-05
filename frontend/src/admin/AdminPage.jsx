// ✅ src/admin/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import MenuOtherPages from "../components/MenuOtherPages";
import LogoLoader from "../components/LogoLoader";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧩 API do backend (Render)
  const API_BASE = import.meta.env.VITE_API_URL || "https://iflow-backend.onrender.com";

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
    console.log("🔍 Verificando permissão de admin...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ Nenhum token encontrado. Redirecionando para login...");
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
        console.log("✅ Usuário autorizado como admin.");
        setUserData(data);
        setIsAuthorized(true);
      } else {
        console.warn("🚫 Usuário não é admin.");
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("❌ Erro na verificação de admin:", err);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LogoLoader />;

  if (!isAuthorized)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="mb-6">
          Você não tem permissão para acessar esta página. Caso ache que isso é um erro,
          contate um administrador.
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
      <MenuOtherPages />
      <div className="pt-28 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Painel Administrativo</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Bem-vindo, <span className="font-semibold">{userData?.name}</span>
          </p>
        </div>
        <DashboardAdmin />
      </div>
    </div>
  );
}
