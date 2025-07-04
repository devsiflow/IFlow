import logo from "../assets/logo.png";

function Menu() {
  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-8">
        <img src={logo} alt="Logo" className="w-32" />
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide"></div>

        {/* Links */}
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-gray-300">
              Como Funciona
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Objetivo
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Sobre nós
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Contato
            </a>
          </li>
        </ul>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-300">Entrar</button>
        <button className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded">
          Cadastro
        </button>
      </div>
    </nav>
  );
}

export default Menu;
