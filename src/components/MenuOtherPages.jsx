import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function MenuOtherPages() {
  const navigate = useNavigate();

  function NavHome() {
    navigate(`/home`);
  }
  function Navlogin() {
    navigate(`/login`);
  }
  function NavCadastro() {
    navigate(`/cadastro`);
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
            <button onClick={NavHome}>Página Incial</button>
          </li>
        </ul>
        <li>
          <button className="font-semibold text-white" onClick={Navlogin}>Login</button>
        </li>
        <button
          onClick={NavCadastro}
          className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastro
        </button>
      </div>
    </nav>
  );
}

export default MenuOtherPages;
