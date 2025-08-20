import objectiveImage from "../assets/ourObjective.jpg";

function ObjectiveSection() {
  return (
    <section
      id="objetivo"
      data-aos="fade-up"
      className="flex flex-col md:flex-row items-center justify-between gap-16 px-8 lg:px-32 py-20 bg-white"
    >
      {/* Imagem */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={objectiveImage}
          alt="Nosso Objetivo"
          className="w-full max-w-lg object-contain"
        />
      </div>

      {/* Texto */}
      <div className="md:w-1/2 text-center md:text-left max-w-2xl">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-[#212121] leading-tight">
          Nosso <span className="text-[#1e3932]">Objetivo</span>
        </h2>
        <p className="text-lg text-[#444] leading-relaxed">
          No <span className="text-[#1e3932] font-semibold">IFlow</span>, buscamos construir um ambiente 
          mais sustentável e humano, onde cada item encontrado tenha a chance de 
          voltar ao seu dono ou ser doado,{" "}
          <span className="font-semibold text-[#1e3932]">
            fortalecendo a responsabilidade coletiva
          </span>{" "}
          e a <span className="font-semibold text-[#1e3932]">solidariedade</span> dentro do IFPR.
        </p>
      </div>
    </section>
  );
}

export default ObjectiveSection;
