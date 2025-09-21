import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.jpg";
import { User, Menu as MenuIcon, X } from "lucide-react"; // Ícones

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user.user_metadata);
        setProfileImage(user.user_metadata?.avatar_url || null);
      }
    };

    fetchUser();

    // Listener para login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user.user_metadata);
        setProfileImage(session.user.user_metadata?.avatar_url || null);
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Navegação
  function NavCadastro() {
    navigate(`/cadastro`);
    setMenuOpen(false);
  }
  function NavLogin() {
    navigate(`/login`);
    setMenuOpen(false);
  }
  function NavMarketPlace() {
    navigate("/marketplace");
    setMenuOpen(false);
  }
  function NavEncontreiItem() {
    navigate("/cadastroitem");
    setMenuOpen(false);
  }
  function handleProfileClick() {
    navigate("/perfil");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-32 sm:w-36 cursor-pointer" onClick={() => navigate("/")} />

      {/* Links - desktop */}
      <ul className="hidden md:flex font-medium space-x-6">
        <li><a href="#sobreNos" className="hover:text-gray-300">Sobre nós</a></li>
        <li><a href="#comoFunciona" className="hover:text-gray-300">Como Funciona</a></li>
        <li><a href="#objetivo" className="hover:text-gray-300">Objetivo</a></li>
        <li><a href="#contato" className="hover:text-gray-300">Contato</a></li>
        <li><a className="hover:text-gray-300 pointer-events-none">|</a></li>
        <li><button onClick={NavMarketPlace} className="hover:text-gray-300">Perdi um item</button></li>
        <li><button onClick={NavEncontreiItem} className="hover:text-gray-300">Encontrei um item</button></li>
      </ul>

      {/* Botões ou perfil - desktop */}
      <div className="hidden md:flex items-center space-x-4">
        {!user ? (
          <>
            <button onClick={NavLogin} className="hover:text-gray-300 font-semibold">Entrar</button>
            <button
              onClick={NavCadastro}
              className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
            >
              Cadastro
            </button>
          </>
        ) : profileImage ? (
          <img
            src={profileImage}
            alt="Foto do usuário"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
            onClick={handleProfileClick}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-gray-100"
            onClick={handleProfileClick}
          >
            <User className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>

      {/* Botão de menu mobile */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
      </button>

      {/* Menu Mobile (sidebar) */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-64 h-screen bg-green-950 shadow-lg p-6 flex flex-col space-y-6 md:hidden z-50">
          <a href="#sobreNos" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">Sobre nós</a>
          <a href="#comoFunciona" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">Como Funciona</a>
          <a href="#objetivo" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">Objetivo</a>
          <a href="#contato" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">Contato</a>
          <hr className="border-gray-600" />
          <button onClick={NavMarketPlace} className="hover:text-gray-300 text-left">Perdi um item</button>
          <button onClick={NavEncontreiItem} className="hover:text-gray-300 text-left">Encontrei um item</button>

          {/* Perfil ou botões */}
          <div className="mt-6">
            {!user ? (
              <div className="flex flex-col space-y-3">
                <button onClick={NavLogin} className="hover:text-gray-300 font-semibold text-left">Entrar</button>
                <button
                  onClick={NavCadastro}
                  className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded w-fit"
                >
                  Cadastro
                </button>
              </div>
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Foto do usuário"
                className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
                onClick={handleProfileClick}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center cursor-pointer bg-gray-100"
                onClick={handleProfileClick}
              >
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Menu;
 