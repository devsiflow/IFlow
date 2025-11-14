// src/hooks/useItens.js
import { useEffect, useState } from "react";
import livroImg from "../assets/livro.jpg";
import { useAuth } from "./useAuth";

export function useItens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchItens() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const campusId = user?.campusId;
        
        console.log("🔄 Buscando itens para campusId:", campusId);

        // Se não tem campusId, busca todos os itens (ou pode retornar vazio)
        const url = campusId 
          ? `${API_URL}/items?campusId=${campusId}`
          : `${API_URL}/items`;

        console.log("📡 URL da requisição:", url);

        const res = await fetch(url);
        
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
        
        // Filtra por campusId no frontend também, para garantir
        const filteredItems = campusId 
          ? itemsArray.filter(item => item.campusId === campusId)
          : itemsArray;

        console.log("🎯 Itens filtrados por campus:", filteredItems.length);

        const itensComImagens = filteredItems.map((item) => ({
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

    // Só busca itens se o usuário estiver carregado (mesmo que campusId seja null)
    if (user !== undefined) {
      fetchItens();
    } else {
      setLoading(false);
    }
  }, [user?.campusId, user]); // Recarrega quando o campusId ou usuário mudar

  return { itens, loading, error };
}