import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User, Menu as MenuIcon, X } from "lucide-react";

function MenuOtherPages() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: supData } = await supabase.auth.getUser();
      if (!supData.user) return;

      setUser(supData.user);

      // 🔑 busca foto real no backend
      const session = (await supabase.auth.getSession())?.data?.session;
      if (session) {
        const res = await fetch("https://iflow-zdbx.onrender.com/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfileImage(data.profilePic || null);
        }
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setProfileImage(session.user?.profilePic || null);
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function NavHome() {
    navigate(`/home`);
    setMenuOpen(false);
  }
  function NavLogin() {
    navigate(`/login`);
    setMenuOpen(false);
  }
  function NavCadastro() {
    navigate(`/cadastro`);
    setMenuOpen(false);
  }
  function NavMarketPlace() {
    navigate(`/marketplace`);
    setMenuOpen(false);
  }
  function NavPerfil() {
    navigate(`/perfil`);
    setMenuOpen(false);
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between relative">
      {/* Logo e Links */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36 cursor-pointer" onClick={NavHome} />
        <ul className="hidden md:flex font-medium space-x-6">
          <li>
            <button onClick={NavHome} className="hover:text-gray-300">Início</button>
          </li>
          <li>
            <button onClick={NavMarketPlace} className="hover:text-gray-300">MarketPlace</button>
          </li>
        </ul>
      </div>

      {/* Botões ou perfil - desktop */}
      <div className="hidden md:flex items-center space-x-4">
        {!user ? (
          <>
            <button onClick={NavLogin} className="hover:text-gray-300 font-semibold">Login</button>
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
            onClick={NavPerfil}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-gray-100"
            onClick={NavPerfil}
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
          <button onClick={NavHome} className="hover:text-gray-300 text-left">Início</button>
          <button onClick={NavMarketPlace} className="hover:text-gray-300 text-left">MarketPlace</button>
          <hr className="border-gray-600" />

          {/* Perfil ou botões */}
          <div className="mt-6">
            {!user ? (
              <div className="flex flex-col space-y-3">
                <button onClick={NavLogin} className="hover:text-gray-300 font-semibold text-left">Login</button>
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
                onClick={NavPerfil}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center cursor-pointer bg-gray-100"
                onClick={NavPerfil}
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

export default MenuOtherPages;
