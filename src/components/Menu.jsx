export default function Menu() {
  return (
    <nav className="bg-green-900 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <span className="text-yellow-400">IFlow</span>
      </div>

      {/* Links */}
      <div className="bg-white">

</div>

      <ul className="flex space-x-6 text-left font-medium ">
        <li><a href="#" className="hover:text-gray-300">Como Funciona</a></li>
        <li><a href="#" className="hover:text-gray-300">Objetivo</a></li>
        <li><a href="#" className="hover:text-gray-300">Sobre nós</a></li>
        <li><a href="#" className="hover:text-gray-300">Contato</a></li>
      </ul>

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