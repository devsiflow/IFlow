import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";

function ValidarItem() {
  const navigate = useNavigate();
  const { id: itemId } = useParams(); // pega o id do item da URL
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    descricao: "",
    localPerda: "",
    detalhesUnicos: "",
    conteudoInterno: "",
    momentoPerda: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/validacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // se usar auth
        },
        body: JSON.stringify({
          itemId: Number(itemId),
          ...form,
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar respostas.");

      const data = await response.json();
      console.log("Validação salva:", data);
      navigate("/validacaoConfirmada");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao enviar a validação. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            {/* Descrição geral */}
            <div>
              <label className="block mb-2 font-semibold">
                Descreva o item em detalhes.
              </label>
              <textarea
                name="descricao"
                rows={3}
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex: Mochila preta com logo da Nike e zíper prateado."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner resize-none transition-all"
              />
            </div>

            {/* Local exato */}
            <div>
              <label className="block mb-2 font-semibold">
                Onde exatamente você perdeu o item?
              </label>
              <input
                name="localPerda"
                type="text"
                value={form.localPerda}
                onChange={handleChange}
                placeholder="Ex: Próximo à cantina ou na escada do bloco B."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner transition-all"
              />
            </div>

            {/* Detalhes únicos */}
            <div>
              <label className="block mb-2 font-semibold">
                Há algo específico ou único no item?
              </label>
              <textarea
                name="detalhesUnicos"
                rows={3}
                value={form.detalhesUnicos}
                onChange={handleChange}
                placeholder="Ex: Tinha uma fita vermelha amarrada, um adesivo, ou etiqueta com meu nome."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner resize-none transition-all"
              />
            </div>

            {/* Conteúdo interno */}
            <div>
              <label className="block mb-2 font-semibold">
                O que havia dentro ou junto do item?
              </label>
              <textarea
                name="conteudoInterno"
                rows={3}
                value={form.conteudoInterno}
                onChange={handleChange}
                placeholder="Ex: Dentro da mochila tinha um caderno azul e um estojo cinza."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner resize-none transition-all"
              />
            </div>

            {/* Momento aproximado */}
            <div>
              <label className="block mb-2 font-semibold">
                Quando você percebeu que havia perdido o item?
              </label>
              <input
                name="momentoPerda"
                type="text"
                value={form.momentoPerda}
                onChange={handleChange}
                placeholder="Ex: Após a aula de matemática, por volta das 10h."
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-inner transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-bold rounded-2xl text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 shadow-[0_0_10px_rgba(21,128,61,0.7)] hover:shadow-[0_0_20px_rgba(21,128,61,0.9)]"
              }`}
            >
              {loading ? "⏳ Enviando..." : "📩 Enviar Respostas para Validação"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ValidarItem;
