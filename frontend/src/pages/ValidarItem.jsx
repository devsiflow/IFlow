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
    console.log("Respostas de validação:", form);
    navigate("/validacaoConfirmada");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Menu fixo */}
      <MenuOtherPages />

      {/* Conteúdo central */}
      <div className="flex flex-col items-center px-4 pt-36 pb-16 md:pt-40">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.08)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-gray-700 p-10 space-y-8 backdrop-blur-sm transition-colors duration-300">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide mb-4 text-center">
            🔐 Validação do Item Perdido
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            Para garantir que o item é realmente seu, responda ao questionário
            com o máximo de detalhes possível.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 text-gray-900 dark:text-gray-100"
          >
            {/* Cor do item */}
            <div>
              <label className="block mb-2 font-semibold">
                Qual a cor principal do item?
              </label>
              <input
                name="cor"
                type="text"
                value={form.cor}
                onChange={handleChange}
                placeholder="Ex: Preto com detalhes vermelhos"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner transition-all"
              />
            </div>

            {/* Local detalhado */}
            <div>
              <label className="block mb-2 font-semibold">
                Onde exatamente você perdeu o item?
              </label>
              <input
                name="localDetalhado"
                type="text"
                value={form.localDetalhado}
                onChange={handleChange}
                placeholder="Ex: Entre o bloco A e o estacionamento"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner transition-all"
              />
            </div>

            {/* Detalhes específicos */}
            <div>
              <label className="block mb-2 font-semibold">
                Há algo específico ou único no item?
              </label>
              <textarea
                name="detalhesEspecificos"
                rows={4}
                value={form.detalhesEspecificos}
                onChange={handleChange}
                placeholder="Ex: Tinha um chaveiro do Pikachu, ou havia uma carta dentro..."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-bold rounded-2xl shadow-[0_0_10px_rgba(21,128,61,0.7)] hover:shadow-[0_0_20px_rgba(21,128,61,0.9)] transition-all duration-300"
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
