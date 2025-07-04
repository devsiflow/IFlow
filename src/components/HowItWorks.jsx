import Step1 from "../assets/howItWorks.jpg";
import Step2 from "../assets/howItWorks2.jpg";

// Substitua os nomes dos arquivos acima pelos nomes reais das suas imagens

function HowItWorks() {
  return (
    <section data-aos="fade-left"
    className="px-8 py-12 text-center">
      <h2 className="text-3xl font-bold mb-8">Como Funciona?</h2>
      <div className="flex-col mx-auto justify-center w-2/3">
        <img src={Step1}></img>
        <img src={Step2}></img>
      </div>
    </section>
  );
}

export default HowItWorks;
