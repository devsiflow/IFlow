import objectiveImage from "../assets/ourObjective.jpg";

function ObjectiveSection() {
  return (
    <section
      id="objetivo"
      data-aos="fade-up"
      className=" flex flex-col md:flex-row items-center justify-between px-8 py-12 text-center md:text-left overflow-hidden"
    >
      {/* Imagem */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={objectiveImage}
          alt="Nosso Objetivo"
          className="w-full max-w-md"
        />
      </div>

      {/* Texto */}
      <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
        <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
          Nosso Objetivo
        </h2>
        <p>
          No IFlow, buscamos construir um ambiente mais sustentável e humano,
          onde cada item encontrado tenha a chance de voltar ao seu dono ou ser
          doado,{" "}
          <span className="font-bold">
            fortalecendo a responsabilidade coletiva
          </span>{" "}
          e a<span className="font-bold"> solidariedade</span> dentro do IFPR.
        </p>
      </div>
    </section>
  );
}

export default ObjectiveSection;
