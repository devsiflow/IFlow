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
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      setUser(session.user);
      setToken(session.access_token);
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Atualiza no load inicial
    updateSession();

    // Atualiza se a sessão mudar
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      updateSession();
    });

    return () => {
      listener.subscription.unsubscribe();
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