import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function AdminFloatingButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("🔍 Verificando se o usuário é admin...");

        const { data: sessionRes } = await supabase.auth.getSession();
        const token = sessionRes?.session?.access_token;

        if (!token) {
          console.warn("❌ Nenhum token encontrado (usuário não logado).");
          return;
        }

        console.log("✅ Token encontrado:", token.slice(0, 20) + "...");

        const res = await fetch("https://iflow-zdbx.onrender.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📡 Resposta do /me:", res.status);

        if (!res.ok) {
          console.error("❌ Erro ao buscar dados do /me:", await res.text());
          return;
        }

        const data = await res.json();
        console.log("📦 Dados do usuário:", data);

        if (data.isAdmin || data.isSuperAdmin) {
          console.log("🟢 Usuário é admin/superadmin");
          setIsAdmin(true);
        } else {
          console.log("🟡 Usuário comum, não é admin.");
        }
      } catch (err) {
        console.error("💥 Erro ao verificar admin:", err);
      }
    };

    checkAdmin();
  }, []);

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => navigate("/admin")}
      className="fixed bottom-6 right-6 z-[1000] bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
      title="Painel Administrativo"
    >
      <Shield className="w-6 h-6" />
    </button>
  );
}
