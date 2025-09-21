import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.jpg";
import { User } from "lucide-react"; // import do ícone

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user.user_metadata);
        if (user.user_metadata?.avatar_url) {
          setProfileImage(user.user_metadata.avatar_url);
        } else {
          setProfileImage(null); // não há avatar, usaremos ícone
        }
      }
    };

    fetchUser();

    // Ouve mudanças no login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user.user_metadata);
        if (session.user.user_metadata?.avatar_url) {
          setProfileImage(session.user.user_metadata.avatar_url);
        } else {
          setProfileImage(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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

  function handleProfileClick() {
    navigate("/perfil"); // Página do usuário
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36" />

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
            <a className="hover:text-gray-300 pointer-events-none">|</a>
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

      {/* Botões ou foto de perfil */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <button onClick={NavLogin} className="hover:text-gray-300 font-semibold">
              Entrar
            </button>
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
    </nav>
  );
}

export default Menu;
