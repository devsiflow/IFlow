import { useNavigate } from "react-router-dom";
import { useState } from "react";
import livroImg from "../assets/livro.jpg";

function ItemCard({ item }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imagens = item.images?.length > 0 ? item.images : [item.imageUrl || livroImg];

  const nextImage = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div
      className="group relative w-full rounded-lg overflow-hidden cursor-pointer border border-neutral-300 dark:border-neutral-700
                 bg-white dark:bg-neutral-800 transition-all duration-300 hover:scale-105"
      onClick={() => navigate(`/itempage/${item.id}`)}
    >
      {/* Carrossel */}
      <div className="relative w-full h-48 overflow-hidden">
        <div className="relative w-full h-full">
          {imagens.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={item.title}
              className={`absolute w-full h-full object-cover transition-all duration-500 ease-in-out
                ${index === currentIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
                } group-hover:scale-110`}
            />
          ))}
        </div>

        {imagens.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 
                         hover:bg-black/90 transition-all duration-300 ease-in-out transform hover:scale-110 
                         opacity-0 group-hover:opacity-100 shadow-lg"
            >
              ❮
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 
                         hover:bg-black/90 transition-all duration-300 ease-in-out transform hover:scale-110 
                         opacity-0 group-hover:opacity-100 shadow-lg"
            >
              ❯
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {imagens.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex 
                      ? "bg-white scale-125 shadow-lg" 
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-2 text-neutral-900 dark:text-neutral-100">
        <h2 className="text-lg font-semibold truncate">{item.title}</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Local:</strong> {item.location}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Cadastrado em:</strong>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Descrição:</strong> {item.description || "Sem descrição"}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/validacao/${item.id}`);
          }}
          className="mt-4 w-full py-3 rounded-md bg-green-600 text-white font-semibold 
                     hover:bg-green-700 transition-all duration-300 transform hover:scale-105
                     shadow-md hover:shadow-lg"
        >
          É meu
        </button>
      </div>
    </div>
  );
}

export default ItemCard;