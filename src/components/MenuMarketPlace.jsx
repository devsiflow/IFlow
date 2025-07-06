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
    navigate("/marketpalce");
  }
  function NavCadastroItem() {
    navigate("/cadastroitem");
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
            <a href="/home" className="hover:text-gray-300">
              Inicio
            </a>
          </li>
          <li>
            <a href="" className="hover:text-gray-300">
              Objetivo
            </a>
          </li>
          <li>
            <a href="/home#sobreNos" className="hover:text-gray-300">
              Sobre nós
            </a>
          </li>
          <li>
            <a href="" className="hover:text-gray-300">
              Meus Itens
            </a>
          </li>
        </ul>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-4">
        <button
          onClick={NavCadastroItem}
          className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastrar Item
        </button>
      </div>
    </nav>
  );
}

export default Menu;
