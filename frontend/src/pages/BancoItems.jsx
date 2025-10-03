// frontend/src/pages/BancoItens.jsx
import { useState, useEffect } from "react";
import { useItens } from "../hooks/useItens";
import MenuBancoItens from "../components/MenuBancoItens";
import { Search } from "lucide-react";
import LogoLoader from "../components/LogoLoader";
import ItemCard from "../components/ItemCard";

function BancoItens() {
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Glow blobs futuristas */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-green-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-ping" />

      {/* Meteoros */}
      <div className="meteors absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 w-0.5 h-10 bg-gradient-to-b from-transparent via-white to-transparent opacity-70 animate-meteor"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${45 + Math.random() * 20}deg)`,
            }}
          />
        ))}
      </div>

      {/* Menu fixo */}
      <MenuBancoItens />

      {/* Conteúdo */}
      <div className="pt-28 p-6 max-w-7xl mx-auto relative z-10">
        {/* Filtros */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Nome */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900/60 border border-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none text-white backdrop-blur-lg shadow-lg transition-all group-hover:border-green-400"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-gray-900/60 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 backdrop-blur-lg shadow-lg transition-all"
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
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-gray-900/60 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 backdrop-blur-lg shadow-lg transition-all"
            />
          </div>

          {/* Data */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 rounded-xl bg-gray-900/60 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 backdrop-blur-lg shadow-lg transition-all"
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
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-16 text-lg">
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

export default BancoItens;
