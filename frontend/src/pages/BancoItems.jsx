import { useState } from "react";
import { useItens } from "../hooks/useItens";
import MenuBancoItens from "../components/MenuBancoItens";
import { Search } from "lucide-react";
import Loading from "../components/loading";
import ItemCard from "../components/ItemCard";

function BancoItens() {
  const { itens, loading, error } = useItens();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [localFilter, setLocalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  if (loading) {
    return Loading();
  }

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
    <div className="min-h-screen bg-gray-50">
      <MenuBancoItens />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Nome */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 border rounded-lg appearance-none"
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
              className="w-full pl-3 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* Data */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Itens */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            Nenhum item encontrado com esses filtros.
          </div>
        )}
      </div>
    </div>
  );
}

export default BancoItens;
