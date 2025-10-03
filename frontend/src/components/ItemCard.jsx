import { useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";

function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative border border-gray-700 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
      onClick={() => navigate(`/itempage/${item.id}`)}
    >
      {/* Imagem com brilho */}
      <div className="w-full h-40 overflow-hidden relative">
        <img
          src={item.imageUrl || livroImg}
          alt={item.title}
          className="w-full h-40 object-contain p-4 transition-transform duration-500 hover:scale-110 brightness-110"
        />
        <div className="absolute inset-0 bg-green-400/10 mix-blend-screen pointer-events-none"></div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 bg-gray-100 space-y-2 text-gray-900">
        <h2 className="text-lg font-bold truncate">{item.title}</h2>
        <p className="text-sm">
          <strong>Data cadastro:</strong> {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm">
          <strong>Local:</strong> {item.location}
        </p>
        <p className="text-sm line-clamp-2">
          <strong>Descrição:</strong> {item.description}
        </p>
        <p className="text-sm">
          <strong>Categoria:</strong> {item.category?.name}
        </p>

        {/* Status neon */}
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
            item.status === "Perdido"
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] hover:shadow-[0_0_20px_rgba(239,68,68,0.9)]"
              : "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.7)] hover:shadow-[0_0_20px_rgba(34,197,94,0.9)]"
          }`}
        >
          {item.status}
        </span>

        {/* Botão futurista */}
        <button
          className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-[0_0_10px_rgba(34,197,94,0.7)] hover:shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/validacao", { state: { item } });
          }}
        >
          É meu
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
