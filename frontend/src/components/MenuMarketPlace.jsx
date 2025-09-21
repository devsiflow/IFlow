import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User, Menu as MenuIcon, X } from "lucide-react";

function MenuMarketPlace() {
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

  function NavCadastroItem() {
    navigate("/cadastroitem");
    setMenuOpen(false);
  }

  function NavInicio() {
    navigate("/home");
    setMenuOpen(false);
  }

  function NavPerfil() {
    navigate("/perfil");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between relative">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36 cursor-pointer" onClick={NavInicio} />
        <button onClick={NavInicio} className="hidden md:block text-white font-bold hover:text-gray-300">
          Início
        </button>
      </div>

      {/* Botões ou foto de perfil - desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={NavCadastroItem}
          className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastrar Item
        </button>

        {user ? (
          profileImage ? (
            <img
              src={profileImage}
              alt="Foto do usuário"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
              onClick={NavPerfil}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-gray-100"
              onClick={NavPerfil}
            >
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )
        ) : (
          <button
            onClick={NavPerfil}
            className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
          >
            Perfil
          </button>
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
          <button onClick={NavInicio} className="hover:text-gray-300 text-left">Início</button>
          <button onClick={NavCadastroItem} className="hover:text-gray-300 text-left">Cadastrar Item</button>

          {/* Perfil ou botão */}
          <div className="mt-6">
            {user ? (
              profileImage ? (
                <img
                  src={profileImage}
                  alt="Foto do usuário"
                  className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
                  onClick={NavPerfil}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center cursor-pointer bg-gray-100"
                  onClick={NavPerfil}
                >
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )
            ) : (
              <button
                onClick={NavPerfil}
                className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded w-fit"
              >
                Perfil
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default MenuMarketPlace;
