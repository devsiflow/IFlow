// src/hooks/useAuth.jsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para atualizar usuário e token
  const updateSession = useCallback(async () => {
  setLoading(true);
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // 🔥 PRIMEIRO: Buscar dados COMPLETOS da Profile
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/me`, {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ Dados do Profile carregados:", userData);
          
          // 🔥 USAR APENAS OS DADOS DO PROFILE
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            matricula: userData.matricula,
            campusId: userData.campusId,
            campus: userData.campus,
            isAdmin: userData.isAdmin,
            isSuperAdmin: userData.isSuperAdmin,
            profilePic: userData.profilePic
          });
        } else {
          console.warn("⚠️ Não foi possível carregar dados do Profile");
          // Fallback: usar dados básicos do Auth
          setUser(session.user);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar Profile:", error);
        setUser(session.user);
      }
      
      setToken(session.access_token);
    } else {
      setUser(null);
      setToken(null);
    }
  } catch (error) {
    console.error("❌ Erro na sessão:", error);
    setUser(null);
    setToken(null);
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    // Atualiza no load inicial
    updateSession();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Evento de auth:", event);
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
        
        // Busca dados completos após login
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const response = await fetch(`${API_URL}/me`, {
            headers: { 
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(prevUser => ({
              ...prevUser,
              ...userData,
              campusId: userData.campusId || null
            }));
          }
        } catch (error) {
          console.error("❌ Erro ao buscar dados após login:", error);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateSession]);

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  return { user, token, loading, updateSession, logout };
}