import { Router, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Menu() {
  const navigate = useNavigate();

  function NavCadastroItem() {
    navigate("/cadastroitem");
  }
   function NavInicio() {
    navigate("/home");
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36" />
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide"></div>

        {/* Links */}
        <button onClick={NavInicio} className="text-white font-bold">
          Início
        </button>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-4">
        <button
          onClick={NavCadastroItem}
          className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastrar Item
        </button>
      </div>
    </nav>
  );
}

export default Menu;
