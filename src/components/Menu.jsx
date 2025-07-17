import { Router, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Menu() {
  const navigate = useNavigate();

  function NavCadastro() {
    navigate(`/cadastro`);
  }

  function NavLogin() {
    navigate(`/login`);
  }

  function NavMarketPlace() {
    navigate("/marketplace");
  }
  function NavEncontreiItem() {
    navigate("/cadastroitem");
  }
  function NavPerdiItem() {
    navigate("/lostitem");
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36" />
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide"></div>

        {/* Links */}
        <ul className="font-medium flex space-x-6">
          <li>
            <a href="#sobreNos" className="hover:text-gray-300">
              Sobre nós
            </a>
          </li>
          <li>
            <a href="#comoFunciona" className="hover:text-gray-300">
              Como Funciona
            </a>
          </li>
          <li>
            <a href="#objetivo" className="hover:text-gray-300">
              Objetivo
            </a>
          </li>
          <li>
            <a href="#contato" className="hover:text-gray-300">
              Contato
            </a>
          </li>
          <li>
            <button onClick={NavMarketPlace} className="hover:text-gray-300">
              Perdi um item
            </button>
          </li>
          <li>
            <button onClick={NavEncontreiItem} className="hover:text-gray-300">
              Encontrei um item
            </button>
          </li>
        </ul>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-4">
        <button onClick={NavLogin} className="hover:text-gray-300">
          Entrar
        </button>
        <button
          onClick={NavCadastro}
          className="bg-green-500 transiotion-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastro
        </button>
      </div>
    </nav>
  );
}

export default Menu;
