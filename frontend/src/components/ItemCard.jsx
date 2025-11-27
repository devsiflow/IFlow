import { useNavigate } from "react-router-dom";
import { useState } from "react";
import livroImg from "../assets/livro.jpg";

function ItemCard({ item }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imagens =
    item.images?.length > 0 ? item.images : [item.imageUrl || livroImg];

  const nextImage = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === imagens.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === 0 ? imagens.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const isPerdido = item.status === "perdido";

  return (
    <div
      onClick={() => navigate(`/itempage/${item.id}`)}
      className={`
        group cursor-pointer transition-all duration-300
        border dark:border-neutral-700 bg-white dark:bg-neutral-800
        rounded-xl shadow-sm hover:shadow-xl

        ${isPerdido
          ? "flex gap-4 p-3 items-center border-l-4 border-l-red-500 hover:-translate-y-1"
          : "flex flex-col hover:scale-[1.03] overflow-hidden"
        }
      `}
    >
      {/* FOTO / CARROSSEL */}
      <div
        className={`
          relative overflow-hidden
          ${isPerdido ? "w-28 h-28 rounded-lg flex-shrink-0" : "w-full h-48"}
        `}
      >
        <div className="relative w-full h-full">
          {imagens.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={item.title}
              className={`
                absolute w-full h-full object-cover transition-all duration-500 ease-in-out
                ${
                  index === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }
                ${isPerdido ? "rounded-lg" : ""}
              `}
            />
          ))}
        </div>

        {!isPerdido && imagens.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 shadow-md hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
            >
              ❮
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 shadow-md hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* CONTEÚDO */}
      <div className={`${isPerdido ? "flex-1" : "p-4 space-y-2"}`}>
        <h2
          className={`font-semibold text-neutral-900 dark:text-neutral-100 ${
            isPerdido ? "text-base" : "text-lg truncate"
          }`}
        >
          {item.title}
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Local:</strong> {item.location}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Cadastrado:</strong>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>

        {!isPerdido && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            <strong>Descrição:</strong> {item.description || "Sem descrição"}
          </p>
        )}

        {/* BOTÃO ATUALIZADO */}
        {isPerdido ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/confirmacao-encontrado/${item.id}`);
            }}
            className="mt-3 w-full py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Encontrei este item
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/validacao/${item.id}`);
            }}
            className="mt-3 w-full py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            É meu
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
