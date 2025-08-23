import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";

function ValidarItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cor: "",
    localDetalhado: "",
    detalhesEspecificos: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode processar a validação ou enviar para análise manual
    console.log("Respostas de validação:", form);
    navigate("/validacaoConfirmada");
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <MenuOtherPages />
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm w-full max-w-2xl p-10">
          <h2 className="text-3xl font-semibold text-neutral-800 mb-6">
            🔐 Validação do Item Perdido
          </h2>
          <p className="text-neutral-600 mb-6">
            Para garantir que o item é realmente seu, responda ao questionário
            com o máximo de detalhes possível.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-neutral-800">
            {/* Cor do item */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Qual a cor principal do item?
              </label>
              <input
                name="cor"
                type="text"
                value={form.cor}
                onChange={handleChange}
                placeholder="Ex: Preto com detalhes vermelhos"
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Local detalhado */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Onde exatamente você perdeu o item?
              </label>
              <input
                name="localDetalhado"
                type="text"
                value={form.localDetalhado}
                onChange={handleChange}
                placeholder="Ex: Entre o bloco A e o estacionamento"
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Detalhes específicos */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Há algo específico ou único no item?
              </label>
              <textarea
                name="detalhesEspecificos"
                rows={4}
                value={form.detalhesEspecificos}
                onChange={handleChange}
                placeholder="Ex: Tinha um chaveiro do Pikachu, ou havia uma carta dentro..."
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              📩 Enviar Respostas para Validação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ValidarItem;
