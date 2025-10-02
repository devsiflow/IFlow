// frontend/src/components/MenuOtherPages.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.jpg";
import { User, X } from "lucide-react";

export default function MenuOtherPages() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Carregar usuário do Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: supData } = await supabase.auth.getUser();
        if (!supData?.user) {
          setUser(null);
          setProfileImage(null);
          return;
        }

        setUser({
          id: supData.user.id,
          name: supData.user.user_metadata?.name || supData.user.email || "Não informado",
          email: supData.user.email,
        });

        // Se tiver foto de perfil
        const sessionRes = await supabase.auth.getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (token) {
          const res = await fetch("https://iflow-zdbx.onrender.com/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setProfileImage(data.profilePic || null);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    };

    fetchUser();

    // Listener de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email || "Não informado",
          email: session.user.email,
        });
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Componente animado para links
  const AnimatedLink = ({ children, ...props }) => (
    <button {...props} className="relative group text-left">
      <span className="inline-block">{children}</span>
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-950 text-white shadow z-[1000]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-36 cursor-pointer" onClick={() => navigate("/home")} />

        {/* Links desktop */}
        <ul className="hidden md:flex font-medium space-x-6">
          <li><AnimatedLink onClick={() => navigate("/home")}>Início</AnimatedLink></li>
          <li><AnimatedLink onClick={() => navigate("/bancoitens")}>Catálogo de itens</AnimatedLink></li>
        </ul>

       {/* Perfil desktop */}
<div className="hidden md:flex items-center space-x-4">
  {!user ? (
    <>
      <button onClick={() => navigate("/login")} className="hover:underline">
        Login
      </button>
      <button
        onClick={() => navigate("/cadastro")}
        className="bg-green-500 px-4 py-1 rounded hover:bg-green-400 transition"
      >
        Cadastro
      </button>
    </>
  ) : (
    <div className="relative group">
      {profileImage ? (
        <img
          src={profileImage}
          alt="Foto do usuário"
          className="w-10 h-10 rounded-full border-2 border-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
          onClick={() => navigate("/perfil")}
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-110"
          onClick={() => navigate("/perfil")}
        >
          <User className="w-6 h-6 text-gray-300" />
        </div>
      )}

      {/* Tooltip desktop */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {user.name}
      </span>
    </div>
  )}
</div>


        {/* Botão hambúrguer mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`block w-8 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`fixed top-0 right-0 w-72 h-full bg-green-950 shadow-lg p-6 flex flex-col gap-8 transform transition-transform duration-300 z-[1000] ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 transition">
          <X className="w-6 h-6" />
        </button>

        {user && (
          <div className="flex flex-col items-center gap-2 mt-8">
            {profileImage ? (
              <img
                src={profileImage}
                alt="perfil"
                className="w-16 h-16 rounded-full border-2 border-white cursor-pointer transform hover:scale-110 transition"
                onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transform hover:scale-110 transition"
                onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
              >
                <User className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <p className="text-white font-semibold">{user.name}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 text-white text-lg">
          <AnimatedLink onClick={() => { navigate("/home"); setMenuOpen(false); }}>Início</AnimatedLink>
          <AnimatedLink onClick={() => { navigate("/bancoitens"); setMenuOpen(false); }}>Catálogo</AnimatedLink>
        </div>

        {!user && (
          <div className="flex flex-col gap-3 mt-auto">
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition">Entrar</button>
            <button onClick={() => { navigate("/cadastro"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition">Cadastro</button>
          </div>
        )}
      </div>
    </nav>
  );
}
