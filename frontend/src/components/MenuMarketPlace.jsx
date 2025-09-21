import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "lucide-react";

function MenuMarketPlace() {
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
          setProfileImage(null);
        }
      }
    };

    fetchUser();

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

  function NavCadastroItem() {
    navigate("/cadastroitem");
  }

  function NavInicio() {
    navigate("/home");
  }

  function NavPerfil() {
    navigate("/perfil");
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36 cursor-pointer" onClick={NavInicio} />
        <button onClick={NavInicio} className="text-white font-bold hover:text-gray-300">
          Início
        </button>
      </div>

      {/* Botões ou foto de perfil */}
      <div className="flex items-center space-x-4">
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
    </nav>
  );
}

export default MenuMarketPlace;
