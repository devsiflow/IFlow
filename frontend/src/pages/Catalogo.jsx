import { useState } from "react";
import { useItens } from "../hooks/useItens";
import MenuCatalogo from "../components/MenuCatalogo";
import { Search } from "lucide-react";
import LogoLoader from "../components/LogoLoader";
import ItemCard from "../components/ItemCard";

function Catalogo() {
  const { itens, loading, error } = useItens();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [localFilter, setLocalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  if (loading) return <LogoLoader />;
  if (error) return <div className="p-6 text-center text-red-500">Erro: {error}</div>;

  const filteredItems = itens.filter((item) => {
    const nameMatch = (item.title ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "Todos" || item.status === statusFilter;
    const localMatch = (item.location ?? "").toLowerCase().includes(localFilter.toLowerCase());
    const dateMatch = !dateFilter || new Date(item.createdAt).toISOString().split("T")[0] === dateFilter;
    return nameMatch && statusMatch && localMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <MenuCatalogo />

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        </div>

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
            <option value="Todos">Todos</option>
            <option value="Perdido">Perdido</option>
            <option value="Encontrado">Encontrado</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} darkMode />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 mt-16 text-sm">
            Nenhum item encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalogo;
