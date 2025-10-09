import { useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";

function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden cursor-pointer border border-neutral-300 dark:border-neutral-700
                 bg-white dark:bg-neutral-800 transition-transform duration-200 hover:scale-105"
      onClick={() => navigate(`/itempage/${item.id}`)}
    >
      {/* Imagem do item */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={item.imageUrl || livroImg}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 space-y-2 text-neutral-900 dark:text-neutral-100">
        <h2 className="text-lg font-semibold truncate">{item.title}</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {item.location}
        </p>
        <p className="text-xs text-neutral-500">
          Cadastrado em: {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm line-clamp-3 text-neutral-700 dark:text-neutral-300">
          {item.description || "Sem descrição"}
        </p>

        {/* Botão “É meu” full width */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/validacao", { state: { item } });
          }}
          className="mt-4 w-full py-3 rounded-md bg-green-600 text-white font-semibold 
                     hover:bg-green-700 transition-colors"
        >
          É meu
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
