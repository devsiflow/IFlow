// frontend/src/pages/ItemPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";
import LogoLoader from "../components/LogoLoader";
import {
  ArrowLeft,
  Cpu,
  Globe2,
  MapPin,
  Calendar,
  User,
  Zap,
} from "lucide-react";


export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://iflow-zdbx.onrender.com/items/${id}`);
        if (!res.ok) throw new Error("Item não encontrado");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <LogoLoader />;
  if (!item)
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-lg">
        Item não encontrado.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white dark:from-black dark:via-emerald-950 dark:to-black text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden">
    

      {/* Botão Voltar */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-900/60 hover:bg-green-200/30 dark:hover:bg-emerald-800/20 border border-green-400 dark:border-emerald-600 text-green-700 dark:text-emerald-500 hover:text-green-800 dark:hover:text-emerald-400 backdrop-blur-md transition-all duration-300"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      {/* Container principal */}
      <div className="flex justify-center items-center min-h-screen px-4 py-20 relative z-10">
        <div className="w-full max-w-6xl bg-white/90 dark:bg-gray-900/60 backdrop-blur-xl border border-green-200/40 dark:border-emerald-700/40 rounded-3xl shadow-[0_0_40px_rgba(0,128,50,0.1)] dark:shadow-[0_0_40px_rgba(0,255,128,0.15)] overflow-hidden hover:shadow-[0_0_60px_rgba(0,128,50,0.2)] dark:hover:shadow-[0_0_60px_rgba(0,255,128,0.3)] transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Imagem */}
            <div className="relative bg-gradient-to-br from-green-50 via-white to-white dark:from-emerald-700/10 dark:via-transparent dark:to-transparent p-10 flex items-center justify-center">
              <div className="absolute inset-0 blur-3xl bg-green-100/20 dark:bg-emerald-700/10 rounded-full" />
              <img
                src={item.imageUrl || livroImg}
                alt={item.title}
                className="relative max-h-[28rem] object-contain rounded-2xl shadow-[0_0_30px_rgba(0,128,50,0.3)] dark:shadow-[0_0_30px_rgba(0,255,128,0.3)] transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Conteúdo */}
            <div className="p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-green-700 dark:text-emerald-600 mb-2">
                  <Cpu size={18} />
                  <span className="uppercase tracking-wider text-xs font-semibold">
                    Registro #{item.id}
                  </span>
                </div>

                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-600 dark:to-emerald-700 bg-clip-text text-transparent">
                  {item.title}
                </h1>

                <p className="text-gray-800 dark:text-gray-300 mt-4 leading-relaxed text-sm">
                  {item.description}
                </p>

                <div className="mt-6 space-y-6 text-sm">
                  <p className="flex items-center gap-2">
                    <Zap size={16} className="text-green-700 dark:text-emerald-600" />
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        item.status === "Perdido"
                          ? "bg-red-200/40 dark:bg-red-600/30 text-red-700 dark:text-red-400 border border-red-400/40"
                          : "bg-green-100/40 dark:bg-green-800/30 text-green-700 dark:text-green-400 border border-green-300/40"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe2 size={16} className="text-green-700 dark:text-emerald-600" />
                    <strong>Categoria:</strong>{" "}
                    <span>{item.category?.name || "—"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-700 dark:text-emerald-600" />
                    <strong>Local:</strong>{" "}
                    <span>{item.location || item.local || "—"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-700 dark:text-emerald-600" />
                    <strong>Data:</strong>{" "}
                    <span>
                      {new Date(item.createdAt || item.date || Date.now()).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <User size={16} className="text-green-700 dark:text-emerald-600" />
                    <strong>Contato:</strong> <span>{item.contact || "Não informado"}</span>
                  </p>
                </div>
              </div>

              {/* Botões futuristas */}
              <div className="mt-10 flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/validacao", { state: { item } });
                  }}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-700 dark:to-emerald-600 text-white font-bold tracking-wide shadow-[0_0_15px_rgba(0,128,50,0.25)] dark:shadow-[0_0_15px_rgba(0,255,128,0.3)] hover:shadow-[0_0_25px_rgba(0,128,50,0.4)] dark:hover:shadow-[0_0_25px_rgba(0,255,128,0.4)] transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  É meu 🚀
                </button>
                <button
                  onClick={() => alert("Relatar - implemente conforme necessidade")}
                  className="flex-1 px-5 py-3 rounded-xl border border-green-400 dark:border-emerald-600 text-green-700 dark:text-emerald-500 hover:bg-green-200/20 dark:hover:bg-emerald-700/20 hover:shadow-[0_0_15px_rgba(0,128,50,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,255,128,0.3)] transition-all duration-300"
                >
                  Relatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fundo animado */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .glow {
          animation: pulseGlow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
