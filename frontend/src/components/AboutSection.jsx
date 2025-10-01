import image from "../assets/whats.png"; 

function AboutSection() {
  return (
    <section
      id="sobreNos"
      className="relative flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-16 lg:px-32 py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100"
      data-aos="fade-up"
    >
      {/* Fundo geométrico suave */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#34d399"
            d="M43.2,-61.5C55.5,-53.7,65.7,-41.7,70.2,-27.9C74.7,-14.1,73.5,1.5,66.6,13.4C59.6,25.3,46.9,33.5,35.1,42.5C23.3,51.6,11.7,61.5,-1.5,63.6C-14.7,65.7,-29.3,59.9,-41.2,49.6C-53.2,39.2,-62.5,24.3,-65.1,7.9C-67.8,-8.5,-63.7,-26.5,-52.9,-37.9C-42.1,-49.2,-24.6,-53.8,-7.8,-52.3C9,-50.7,18.1,-43.2,43.2,-61.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Texto */}
      <div className="md:w-1/2 text-center md:text-left max-w-2xl space-y-6">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          O Que é o{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
            IFlow
          </span>
          ?
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          O <span className="font-semibold text-emerald-700">IFlow</span> é uma
          plataforma digital criada para facilitar a{" "}
          <span className="font-semibold text-emerald-700">
            gestão de itens achados, perdidos e doados
          </span>{" "}
          no ambiente escolar.
        </p>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Desenvolvido especialmente para a comunidade dos{" "}
          <span className="font-semibold">Institutos Federais</span>, o sistema
          promove a{" "}
          <span className="font-semibold text-emerald-700">
            responsabilidade coletiva
          </span>{" "}
          e a{" "}
          <span className="font-semibold text-emerald-700">solidariedade</span>,
          através de um fluxo inteligente de devoluções, solicitações e
          recompensas por boas ações.
        </p>
      </div>

      {/* Imagem mais clean */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={image}
          alt="O que é o IFlow"
          className="w-full max-w-md object-contain rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
        />
      </div>
    </section>
  );
}

export default AboutSection;
