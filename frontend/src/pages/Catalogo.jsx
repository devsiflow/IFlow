import { useState } from "react";
import { useItens } from "../hooks/useItens";
import { useAuth } from "../hooks/useAuth";
import MenuCatalogo from "../components/MenuCatalogo";
import { Search } from "lucide-react";
import LogoLoader from "../components/LogoLoader";
import ItemCard from "../components/ItemCard";

function Catalogo() {
  const { itens, loading, error } = useItens();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [localFilter, setLocalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const campusId = user?.campusId;
  console.log("👤 Usuário logado:", user?.name, "CampusId:", campusId);
  console.log("📦 Total de itens carregados:", itens.length);

  // Filtra os itens - REMOVIDO filtro por campus aqui pois já é feito no hook
  const filteredItems = itens.filter((item) => {
    const nameMatch = (item.title ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "Todos" || item.status === statusFilter;
    const localMatch = (item.location ?? "")
      .toLowerCase()
      .includes(localFilter.toLowerCase());
    const dateMatch =
      !dateFilter ||
      new Date(item.createdAt).toISOString().split("T")[0] === dateFilter;
    
    return nameMatch && statusMatch && localMatch && dateMatch;
  });

  console.log("🎯 Itens após filtros:", filteredItems.length);

  if (loading) return <LogoLoader />;
  if (error)
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <MenuCatalogo />
        <div className="pt-32 px-6 text-center text-red-500">
          Erro: {error}
          <p className="text-sm mt-2">CampusId do usuário: {user?.campusId}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <MenuCatalogo />

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        {/* Informação do campus */}
        {campusId && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              🎯 Mostrando itens do seu campus
              {itens[0]?.campus?.nome && ` - ${itens[0].campus.nome}`}
            </p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-green-600"
          >
            <option value="Todos">Todos os status</option>
            <option value="perdido">Perdido</option>
            <option value="encontrado">Encontrado</option>
          </select>

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

        {/* Itens */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 mt-16 text-sm">
            {itens.length === 0 
              ? `Nenhum item encontrado no seu campus${user?.campusId ? ` (Campus ID: ${user.campusId})` : ''}.`
              : "Nenhum item corresponde aos filtros aplicados."
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalogo;