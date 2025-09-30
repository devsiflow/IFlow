import { useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";

function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
      <img
        src={item.imageUrl || livroImg}
        alt={item.title}
        className="w-full h-40 object-contain p-4"
      />
      <div className="p-4 bg-gray-50 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
        <p className="text-sm text-gray-600">
          <strong>Data:</strong> {new Date(item.createdAt).toLocaleDateString()}
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
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-md ${
            item.status === "Perdido"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {item.status}
        </span>

        {/* Botão com rota para validação */}
        <button
          className="mt-4 w-full transition-colors duration-500 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          onClick={() => navigate("/validacao")}
        >
          É meu
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
