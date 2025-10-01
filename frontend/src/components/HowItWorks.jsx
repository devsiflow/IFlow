import { Search, ClipboardList, Send, PackagePlus, ArrowRight } from "lucide-react";

function HowItWorks() {
  return (
    <section
      id="comoFunciona"
      data-aos="fade-up"
      className="px-6 py-16 text-center bg-slate-100"
    >
      <h2 className="text-3xl font-bold mb-12">Como Funciona?</h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Fluxo: Perdeu um item */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Perdeu um item?</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <Search className="w-12 h-12 text-green-600" />
              <p className="mt-2 text-sm">Procure no catálogo</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-500" />
            <div className="flex flex-col items-center">
              <ClipboardList className="w-12 h-12 text-green-600" />
              <p className="mt-2 text-sm">Veja os achados</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-500" />
            <div className="flex flex-col items-center">
              <Send className="w-12 h-12 text-green-600" />
              <p className="mt-2 text-sm">Solicite a devolução</p>
            </div>
          </div>
        </div>

        {/* Fluxo: Achou um item */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Achou um item?</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <PackagePlus className="w-12 h-12 text-green-600" />
              <p className="mt-2 text-sm">Cadastre no sistema</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-500" />
            <div className="flex flex-col items-center">
              <ClipboardList className="w-12 h-12 text-green-600" />
              <p className="mt-2 text-sm">Disponível no catálogo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
