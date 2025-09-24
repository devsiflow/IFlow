import { useEffect, useState } from "react";

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
        setItens(data);
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
