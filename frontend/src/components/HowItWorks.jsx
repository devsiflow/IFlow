import Step1 from "../assets/12.png";

// Substitua os nomes dos arquivos acima pelos nomes reais das suas imagens

function HowItWorks() {
  return (
    <section
      id="comoFunciona"
      data-aos="fade-up"
      className="px-8 py-12 text-center bg-slate-100 overflow-hidden"
    >
      <h2 className="text-3xl font-bold mb-8">Como Funciona?</h2>
      <div className="flex-col mx-auto justify-center w-1/2">
        <img src={Step1}></img>
      </div>
    </section>
  );
}

export default HowItWorks;
