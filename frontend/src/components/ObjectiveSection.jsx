import objectiveImage from "../assets/ourObjective.jpg";

function ObjectiveSection() {
  return (
    <section
      id="objetivo"
      data-aos="fade-up"
      className="relative group flex flex-col md:flex-row items-center justify-between gap-16 px-8 lg:px-32 py-24 bg-gradient-to-br from-white via-gray-50 to-emerald-50 overflow-hidden"
    >
      {/* Meteoros (visíveis apenas no hover) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-12 bg-gradient-to-b from-emerald-500 to-transparent opacity-0 blur-sm rounded-full group-hover:opacity-80 animate-meteor"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Imagem futurista */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={objectiveImage}
          alt="Nosso Objetivo"
          className="w-full max-w-lg object-contain rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Texto futurista com card glass */}
      <div className="md:w-1/2 text-center md:text-left max-w-2xl bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-emerald-200/50 transition-transform duration-300 group-hover:scale-[1.02]">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 leading-tight">
          Nosso{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
            Objetivo
          </span>
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          No{" "}
          <span className="text-emerald-600 font-semibold">IFlow</span>, buscamos construir um ambiente
          mais sustentável e humano, onde cada item encontrado tenha a chance de
          voltar ao seu dono ou ser doado,{" "}
          <span className="font-semibold text-emerald-600">
            fortalecendo a responsabilidade coletiva
          </span>{" "}
          e a{" "}
          <span className="font-semibold text-emerald-600">solidariedade</span> dentro do IFPR.
        </p>
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

export default ObjectiveSection;
