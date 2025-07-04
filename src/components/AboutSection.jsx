import image from "../assets/what's.jpg"; // Substitua pelo nome real da sua imagem

function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-12"
    data-aos="fade-right"
    >
      {/* Texto */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">O Que é o IFlow?</h2>
        <p className="mb-4">
          O IFlow é uma plataforma digital criada para facilitar a{" "}
          <span className="font-bold">
            gestão de itens achados, perdidos e doados no ambiente escolar
          </span>
          .
        </p>
        <p>
          Desenvolvido especialmente para a comunidade dos Institutos Federais,
          o sistema promove a{" "}
          <span className="font-bold">responsabilidade coletiva</span> e a{" "}
          <span className="font-bold">solidariedade</span> por meio de um fluxo
          inteligente de devoluções, solicitações e recompensas por boas ações.
          <span className="bg-green-400 text-black ml-1">
            Tudo isso de forma simples, rápida e acessível.
          </span>
        </p>
      </div>

      {/* Imagem */}
      <div className="md:w-1/2 flex justify-center">
        <img src={image} alt="O que é o IFlow" className="w-full max-w-md" />
      </div>
    </section>
  );
}

export default AboutSection;
