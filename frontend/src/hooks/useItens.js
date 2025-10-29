import { useEffect, useState } from "react";
import livroImg from "../assets/livro.jpg";

export function useItens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItens() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/items`);

        if (!res.ok) {
          throw new Error(`Erro ao buscar itens: ${res.status}`);
        }

        const data = await res.json();
        console.log("Resposta da API /items:", data);

        // Se o backend retorna { items, total }
        const itemsArray = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];

        // Garantir que cada item tenha imagens válidas
        const itensComImagens = itemsArray.map((item) => ({
          ...item,
          images:
            item.images?.length > 0
              ? item.images
                  .map((img) => img?.url)
                  .filter(Boolean)
              : [item.imageUrl || livroImg],
        }));

        setItens(itensComImagens);
      } catch (err) {
        console.error("Erro no useItens:", err);
        setError(err.message || "Erro ao carregar itens");
      } finally {
        setLoading(false);
      }
    }

    fetchItens();
  }, []);

  return { itens, loading, error };
}
