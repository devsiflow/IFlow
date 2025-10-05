import { useState, useEffect } from "react";
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

  if (error) {
    return <div className="p-6 text-center text-red-500">Erro: {error}</div>;
  }

  const filteredItems = itens.filter((item) => {
    const nameMatch = (item.title ?? "")
      .toLowerCase()
      .includes((searchTerm ?? "").toLowerCase());

    const statusMatch =
      statusFilter === "Todos" || item.status === statusFilter;

    const localMatch = (item.location ?? "")
      .toLowerCase()
      .includes((localFilter ?? "").toLowerCase());

    const dateMatch =
      !dateFilter ||
      new Date(item.createdAt).toISOString().split("T")[0] === dateFilter;

    return nameMatch && statusMatch && localMatch && dateMatch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Meteoros */}
      <div className="meteors absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 w-0.5 h-10 opacity-70 animate-meteor"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${45 + Math.random() * 20}deg)`,
              background: "linear-gradient(to bottom, #22c55e, transparent)", // verde
            }}
          />
        ))}
      </div>

      {/* Menu fixo */}
      <MenuCatalogo />

      {/* Conteúdo */}
      <div className="pt-28 p-6 max-w-7xl mx-auto relative z-10">
        {/* Filtros */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Nome */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-md transition-all group-hover:border-green-400"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 shadow-md transition-all"
            >
              <option value="Todos">Todos os status</option>
              <option value="Perdido">Perdido</option>
              <option value="Encontrado">Encontrado</option>
            </select>
          </div>

          {/* Local */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filtrar por local..."
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 shadow-md transition-all"
            />
          </div>

          {/* Data */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 shadow-md transition-all"
            />
          </div>
        </div>

        {/* Itens */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="hover:scale-105 transition-transform duration-300"
              >
                <ItemCard item={item} darkMode />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-16 text-lg">
            Nenhum item encontrado com esses filtros.
          </div>
        )}
      </div>

      {/* Estilos extras para meteoros */}
      <style jsx>{`
        .animate-meteor {
          animation-name: meteor;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes meteor {
          0% {
            transform: translateY(-100vh) rotate(45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Catalogo;
