import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import MenuOtherPages from "../components/MenuOtherPages";
import { Search } from "lucide-react";
import LogoLoader from "../components/LogoLoader";
import ItemCard from "../components/ItemCard";

export default function ItensNaoEncontrados() {
  const { user, loading: authLoading, token } = useAuth();

  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [localFilter, setLocalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const campusId = user?.campusId;

  useEffect(() => {
    async function fetchPerdidos() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/items?status=perdido`, {
          headers,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();

        // 🔥 NORMALIZAR IMAGENS PARA O ItemCard (igual useItens)
        const normalizados = (data.items || []).map((item) => ({
          ...item,
          images:
            item.images?.length > 0
              ? item.images.map((img) => img?.url).filter(Boolean)
              : [],
        }));

        setItens(normalizados);
      } catch (err) {
        console.error("Erro ao buscar perdidos:", err);
        setError("Erro ao carregar itens perdidos");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) fetchPerdidos();
  }, [authLoading, token]);

  if (authLoading || loading) return <LogoLoader />;

  // 🔥 Filtrar por campus
  let perdidos = itens;
  if (campusId) {
    perdidos = perdidos.filter((item) => item.campusId === campusId);
  }

  // 🔥 Filtros adicionais
  const filteredItems = perdidos.filter((item) => {
    const nameMatch =
      (item.title ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const localMatch =
      (item.location ?? "").toLowerCase().includes(localFilter.toLowerCase());
    const dateMatch =
      !dateFilter ||
      new Date(item.createdAt).toISOString().split("T")[0] === dateFilter;

    return nameMatch && localMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <MenuOtherPages />

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Itens não encontrados</h1>

        {campusId ? (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              🎯 Mostrando apenas itens do seu campus (
              {user?.campus?.nome || `ID: ${campusId}`}
              )
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ Seu perfil não tem campus definido. Mostrando itens perdidos de todos os campus.
            </p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          <input
            type="text"
            placeholder="Local..."
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-green-600"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Lista */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 mt-16 text-sm">
            Nenhum item perdido encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
