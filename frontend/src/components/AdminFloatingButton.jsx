/* eslint-disable no-unused-vars */
// src/components/AdminFloatingButton.jsx
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

        // Pega sessão atual (supabase JS v2 -> { data: { session }})
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const refreshToken = sessionData?.session?.refresh_token;

        if (!token) {
          console.warn("❌ Nenhum token encontrado (usuário não logado).");
          return;
        }

        console.log("✅ Token encontrado (começo):", token.slice(0, 20) + "...");

        // Faz a chamada ao backend com o access_token atual
        const API = import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📡 Resposta do /me:", res.status);

        if (res.status === 401) {
          // Token expirado: tentar forçar refresh via supabase client
          console.warn("⚠️ Token expirado segundo backend, tentando renovar via supabase...");

          // Chamar getSession novamente pode acionar refresh automático (se config ativada)
          const { data: newSessionData, error } = await supabase.auth.refreshSession();
          // Nota: refreshSession existe em algumas versões/impl. Se não existir, getSession com autoRefresh faz por baixo.
          // fallback: chamar getSession novamente
          if (error) {
            console.warn("refreshSession retornou erro (pode não existir nesta versão):", error);
            // tentar apenas getSession (autoRefreshToken pode ter rodado já)
            const { data: gs } = await supabase.auth.getSession();
            if (gs?.session?.access_token) {
              const newToken = gs.session.access_token;
              const r2 = await fetch(`${API}/me`, {
                headers: { Authorization: `Bearer ${newToken}` },
              });
              if (r2.ok) {
                const d = await r2.json();
                if (d.isAdmin || d.isSuperAdmin) setIsAdmin(true);
              }
            }
            return;
          }

          if (newSessionData?.session?.access_token) {
            const newToken = newSessionData.session.access_token;
            const r2 = await fetch(`${API}/me`, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            if (r2.ok) {
              const d = await r2.json();
              if (d.isAdmin || d.isSuperAdmin) setIsAdmin(true);
            } else {
              console.warn("Ainda não foi possível obter /me após refresh:", r2.status, await r2.text());
            }
            return;
          }

          console.warn("Não foi possível renovar token automaticamente.");
          return;
        }

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
      className="fixed bottom-6 right-6 z-[1000] flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-green-500/30 transition-all transform hover:scale-110 hover:shadow-green-400/40"
      title="Painel Administrativo"
    >
      <Shield className="w-5 h-5" />
      <span className="font-medium hidden sm:inline">Painel Admin</span>
    </button>
  );
}
