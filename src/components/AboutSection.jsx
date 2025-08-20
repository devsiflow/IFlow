import image from "../assets/what's.jpg"; 

function AboutSection() {
  return (
    <section
  id="sobreNos"
  className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 lg:px-32 py-20 bg-[#F5F5F5]"
  data-aos="fade-up"
>
  {/* Texto */}
  <div className="md:w-1/2 text-center md:text-left max-w-2xl">
    <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-[#212121] leading-tight">
      O Que é o <span className="text-[#1e3932]">IFlow</span>?
    </h2>
    <p className="text-lg text-[#444] mb-6 leading-relaxed">
      O <span className="text-[#1e3932] font-semibold">IFlow</span> é uma plataforma digital criada para facilitar a{" "}
      <span className="font-semibold text-[#1e3932]">
        gestão de itens achados, perdidos e doados
      </span>{" "}
      no ambiente escolar.
    </p>
    <p className="text-lg text-[#444] leading-relaxed">
      Desenvolvido especialmente para a comunidade dos{" "}
      <span className="font-semibold">Institutos Federais</span>, 
      o sistema promove a{" "}
      <span className="font-semibold text-[#1e3932]">responsabilidade coletiva</span> e a{" "}
      <span className="font-semibold text-[#1e3932]">solidariedade</span>, 
      através de um fluxo inteligente de devoluções, solicitações e recompensas por boas ações.
    </p>
  </div>

  {/* Imagem */}
  <div className="md:w-1/2 flex justify-center">
    <img
      src={image}
      alt="O que é o IFlow"
      className="w-full max-w-lg object-contain"
    />
  </div>
</section>

  );
}

export default AboutSection;
