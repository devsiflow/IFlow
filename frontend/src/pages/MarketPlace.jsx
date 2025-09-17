import { useState } from "react";
import { useItens } from "../hooks/useItens";
import MenuMarketPlace from "../components/MenuMarketPlace";
import livroImg from "../assets/livro.jpg";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MarketPlace() {
  const { itens, loading, error } = useItens();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [localFilter, setLocalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  if (loading) {
    return <div className="p-6 text-center">Carregando itens...</div>;
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
      <MenuMarketPlace />
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
              <div
                key={item.id}
                className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
              >
                <img
                  src={item.imageUrl || livroImg}
                  alt={item.title}
                  className="w-full h-40 object-contain p-4"
                />
                <div className="p-4 bg-gray-50 space-y-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Data:</strong>{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Local:</strong> {item.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Descrição:</strong> {item.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Categoria:</strong> {item.category?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Contato:</strong> {item.user?.email}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "Perdido"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* Botão com rota para validação */}
                  <button
                    className="mt-4 w-full transition-colors duration-500 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    onClick={() => navigate("/validacao")}
                  >
                    É meu
                  </button>
                </div>
              </div>
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

export default MarketPlace;
