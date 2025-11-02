
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import livroImg from "../assets/livro.jpg";
import LogoLoader from "../components/LogoLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://iflow-zdbx.onrender.com/items/${id}`);
        if (!res.ok) throw new Error("Item não encontrado");
        const data = await res.json();
        console.log("Item recebido:", data);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const images = item?.images && item.images.length > 0 
    ? item.images.map(img => img.url) 
    : [livroImg];

  const nextImage = () => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToImage = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading) return <LogoLoader />;

  if (!item)
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-lg">
        Item não encontrado.
      </p>
    );

  const handleValidar = () => navigate(`/validacao/${item.id}`);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-4">
      <MenuOtherPages />

      <div className="w-full max-w-5xl bg-white dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-md flex flex-col md:flex-row gap-6 mt-10">
        {/* Coluna esquerda: carrossel */}
        <div className="md:w-1/2 h-96 bg-neutral-200 dark:bg-neutral-700 relative flex items-center justify-center overflow-hidden rounded-xl">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-full">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${item.title} - ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-all duration-500 ease-in-out
                      ${index === currentIndex 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                      } hover:scale-105`}
                    onError={(e) => {
                      console.error("Erro ao carregar imagem:", images[currentIndex]);
                      e.target.src = livroImg;
                    }}
                  />
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full 
                               hover:bg-black/90 transition-all duration-300 ease-in-out transform hover:scale-110 
                               shadow-lg"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full 
                               hover:bg-black/90 transition-all duration-300 ease-in-out transform hover:scale-110 
                               shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Indicadores de imagem */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                        onClick={() => goToImage(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500">
              <img
                src={livroImg}
                alt="Imagem padrão"
                className="w-32 h-32 object-cover opacity-50"
              />
              <p className="mt-2">Sem imagem</p>
            </div>
          )}
        </div>

        {/* Coluna direita: infos */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{item.title}</h1>

            <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
              <p>
                <strong>Data cadastro:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Local:</strong> {item.location || "—"}
              </p>
              <p>
                <strong>Categoria:</strong> {item.category?.name || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  item.status === "perdido" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {item.status || "Não informado"}
                </span>
              </p>
              <p className="line-clamp-6">
                <strong>Descrição:</strong> {item.description || "Sem descrição"}
              </p>
            </div>
          </div>

          <button
            onClick={handleValidar}
            className="w-full py-4 mt-6 rounded-md bg-green-600 dark:bg-green-700 text-white font-semibold 
                       hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                       shadow-md hover:shadow-lg"
          >
            Solicitar
          </button>
        </div>
      </div>
    </div>
  );
}
