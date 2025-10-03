import image from "../assets/whats.png";

function AboutSection() {
  return (
    <section
      id="sobreNos"
      className="relative group flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-16 lg:px-32 py-24 bg-gradient-to-br from-white via-gray-50 to-emerald-50 overflow-hidden"
      data-aos="fade-up"
    >
      {/* Meteoros (visíveis no hover) */}
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

      {/* Texto futurista */}
      <div className="md:w-1/2 text-center md:text-left max-w-2xl space-y-6 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-emerald-200/50 transition-transform duration-300 group-hover:scale-[1.02]">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          O Que é o{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
            IFlow
          </span>
          ?
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          O <span className="font-semibold text-emerald-600">IFlow</span> é uma
          plataforma digital criada para facilitar a{" "}
          <span className="font-semibold text-emerald-600">
            gestão de itens achados, perdidos e doados
          </span>{" "}
          no ambiente escolar.
        </p>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Desenvolvido especialmente para a comunidade dos{" "}
          <span className="font-semibold text-gray-900">Institutos Federais</span>, 
          o sistema promove a{" "}
          <span className="font-semibold text-emerald-600">
            responsabilidade coletiva
          </span>{" "}
          e a{" "}
          <span className="font-semibold text-emerald-600">solidariedade</span>,
          através de um fluxo inteligente de devoluções, solicitações e
          recompensas por boas ações.
        </p>
      </div>

      {/* Imagem futurista clean */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={image}
          alt="O que é o IFlow"
          className="w-full max-w-md object-contain rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-transform duration-500 hover:scale-110"
        />
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

export default AboutSection;
