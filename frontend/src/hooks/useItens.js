import { useEffect, useState } from "react";
import livroImg from "../assets/livro.jpg";
import { useAuth } from "./useAuth"; // Importando o hook de autenticação

export function useItens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Pegando o usuário logado

  useEffect(() => {
    async function fetchItens() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const campusId = user?.campusId; // Verifique se o valor de campusId está correto
        console.log("campusId do usuário:", campusId); // Log para verificar o valor

        // Se for necessário, filtre os itens pela campusId aqui
        const res = await fetch(`${API_URL}/items?campusId=${campusId}`);
        console.log(
          "URL da requisição:",
          `${API_URL}/items?campusId=${campusId}`
        ); // Log para verificar a URL

        if (!res.ok) {
          throw new Error(`Erro ao buscar itens: ${res.status}`);
        }

        const data = await res.json();
        console.log("Resposta da API /items:", data);

        // Processamento dos itens conforme necessário
        const itemsArray = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        const itensComImagens = itemsArray.map((item) => ({
          ...item,
          images:
            item.images?.length > 0
              ? item.images.map((img) => img?.url).filter(Boolean)
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
  }, [user]); // Dependência de 'user' para atualizar quando o usuário mudar

  return { itens, loading, error };
}
