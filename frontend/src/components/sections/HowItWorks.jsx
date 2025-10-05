// src/components/HowItWorks.jsx  (ou src/pages/HowItWorks.jsx conforme seu projeto)
import {
  Search,
  ClipboardList,
  Send,
  PackagePlus,
  ArrowRight,
} from "lucide-react";

function HowItWorks() {
  return (
    <section
      id="comoFunciona"
      data-aos="fade-up"
      className="relative group px-6 py-20 text-center overflow-hidden
                 bg-gradient-to-br from-white via-slate-50 to-emerald-50
                 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900"
    >
      {/* Meteoros (ficam visíveis no hover) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-12 bg-gradient-to-b from-emerald-500 dark:from-emerald-300 to-transparent
                       opacity-0 blur-sm rounded-full group-hover:opacity-80 animate-meteor"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-gray-100">
        Como Funciona?
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        {/* Fluxo: Perdeu um item */}
        <div className="transition-transform duration-300 group-hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 text-emerald-700 dark:text-emerald-300">
            Perdeu um item?
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div
              className="flex flex-col items-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-md
                         px-6 py-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700
                         text-gray-700 dark:text-gray-300"
            >
              <Search className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Procure no catálogo</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400 dark:text-gray-500" />

            <div
              className="flex flex-col items-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-md
                         px-6 py-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700
                         text-gray-700 dark:text-gray-300"
            >
              <ClipboardList className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Veja os achados</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400 dark:text-gray-500" />

            <div
              className="flex flex-col items-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-md
                         px-6 py-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700
                         text-gray-700 dark:text-gray-300"
            >
              <Send className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Solicite a devolução</p>
            </div>
          </div>
        </div>

        {/* Fluxo: Achou um item */}
        <div className="transition-transform duration-300 group-hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 text-emerald-700 dark:text-emerald-300">
            Achou um item?
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div
              className="flex flex-col items-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-md
                         px-6 py-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700
                         text-gray-700 dark:text-gray-300"
            >
              <PackagePlus className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Cadastre no sistema</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400 dark:text-gray-500" />

            <div
              className="flex flex-col items-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-md
                         px-6 py-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700
                         text-gray-700 dark:text-gray-300"
            >
              <ClipboardList className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Disponível no catálogo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animação dos meteoros */}
      <style>{`
        @keyframes meteor {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(25deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(-200px) rotate(25deg);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;
