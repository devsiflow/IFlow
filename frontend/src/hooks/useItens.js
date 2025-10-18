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
          throw new Error("Erro ao buscar itens");
        }

        const data = await res.json();

        // Transformar cada item para garantir que images seja sempre array válido
        const itensComImagens = data.map(item => ({
          ...item,
          images:
            item.images?.length > 0
              ? item.images
                  .map(img => img?.url) // Protege contra img null
                  .filter(Boolean)      // Remove undefined/null
              : [item.imageUrl || livroImg], // Fallback para imagem padrão
        }));

        setItens(itensComImagens);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItens();
  }, []);

  return { itens, loading, error };
}
