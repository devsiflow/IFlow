import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";

function CadastrarItem() {
  const navigate = useNavigate();

  function NavCadastro() {
    navigate(`/cadastro`);
  }

  function NavLogin() {
    navigate(`/login`);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <MenuOtherPages />

      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-md rounded-2xl max-w-md w-full p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black ">
            Cadastre um Item Perdido ou Achado
          </h2>

          <form className="space-y-4">
            {/* Título do item */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Item
              </label>
              <input
                type="text"
                placeholder="Ex: Chave, Mochila..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                placeholder="Descreva características, cor, local encontrado..."
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              ></textarea>
            </div>

            {/* Local ou data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local (obrigatório)
              </label>
              <input
                type="text"
                placeholder="Ex: Sala 101, pátio, data..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data (opcional)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto do Item (obrigatório)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-whit file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-green-500 file:text-white
                         hover:file:bg-green-400"
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-md w-full "
            >
              Cadastrar Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarItem;
