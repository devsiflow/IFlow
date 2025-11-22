// src/hooks/useItens.js
import { useEffect, useState } from "react";
import livroImg from "../assets/livro.jpg";
import { useAuth } from "./useAuth";

export function useItens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth(); // 🔥 PEGAR TOKEN TAMBÉM

  useEffect(() => {
    async function fetchItens() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        console.log("🔄 Buscando itens para usuário:", user?.name);
        console.log("🎯 Campus do usuário:", user?.campusId);

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/items`, {
          headers
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Erro na resposta:", res.status, errorText);
          throw new Error(`Erro ao buscar itens: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log("✅ Resposta da API /items:", data);

        const itemsArray = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];

        console.log("📦 Itens recebidos:", itemsArray.length);
        
        // 🔥 REMOVER FILTRO NO FRONTEND - O BACKEND JÁ FILTROU
        const itensComImagens = itemsArray.map((item) => ({
          ...item,
          images:
            item.images?.length > 0
              ? item.images.map((img) => img?.url).filter(Boolean)
              : [item.imageUrl || livroImg],
        }));

        setItens(itensComImagens);
      } catch (err) {
        console.error("❌ Erro no useItens:", err);
        setError(err.message || "Erro ao carregar itens");
      } finally {
        setLoading(false);
      }
    }

    // Só busca itens se o usuário estiver carregado
    if (user !== undefined) {
      fetchItens();
    } else {
      setLoading(false);
    }
  }, [user, token]); // 🔥 ADICIONAR TOKEN COMO DEPENDÊNCIA

  return { itens, loading, error };
}