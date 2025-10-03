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

  const AnimatedLink = ({ children, ...props }) => (
    <button
      {...props}
      className="relative group font-medium text-lg text-white hover:text-green-400 transition-colors"
    >
      <span className="inline-block">{children}</span>
      <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 rounded-full"></span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 w-full h-24 flex items-center px-6 bg-green-950 z-[1000] shadow">
      <img
        src={logo}
        alt="Logo"
        className="w-36 cursor-pointer"
        onClick={() => navigate("/home")}
      />

      <ul className="hidden md:flex ml-10 space-x-8">
        <li>
          <AnimatedLink onClick={() => navigate("/home")}>Início</AnimatedLink>
        </li>
        <li>
          <AnimatedLink onClick={() => navigate("/bancoitens")}>Catálogo de itens</AnimatedLink>
        </li>
      </ul>

      <div className="hidden md:flex items-center ml-auto space-x-4">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white font-medium hover:text-green-400 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/cadastro")}
              className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Cadastrar
            </button>
          </>
        ) : (
          <div className="relative group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Perfil"
                className="w-10 h-10 rounded-full border-2 border-green-400 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => navigate("/perfil")}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center cursor-pointer transform hover:scale-110 transition"
                onClick={() => navigate("/perfil")}
              >
                <User className="w-6 h-6 text-gray-300" />
              </div>
            )}
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {user.name}
            </span>
          </div>
        )}
      </div>

      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1 ml-auto"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
        <span className={`block w-8 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
      </button>

      <div className={`fixed top-0 right-0 w-72 h-full bg-green-950 shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300 z-[1000] ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white hover:text-green-400 transition">
          <X className="w-6 h-6" />
        </button>

        {user && (
          <div className="flex flex-col items-center gap-2 mt-12">
            {profileImage ? (
              <img
                src={profileImage}
                alt="perfil"
                className="w-16 h-16 rounded-full border-2 border-green-400 cursor-pointer transform hover:scale-110 transition"
                onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center cursor-pointer transform hover:scale-110 transition" onClick={() => { setMenuOpen(false); navigate("/perfil"); }}>
                <User className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <p className="text-white font-semibold">{user.name}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-6">
          <AnimatedLink onClick={() => { navigate("/home"); setMenuOpen(false); }}>Início</AnimatedLink>
          <AnimatedLink onClick={() => { navigate("/bancoitens"); setMenuOpen(false); }}>Catálogo</AnimatedLink>
          <AnimatedLink onClick={() => { navigate("/cadastroitem"); setMenuOpen(false); }}>Cadastrar Item</AnimatedLink>
        </div>

        {!user && (
          <div className="flex flex-col gap-3 mt-auto">
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-green-500 hover:text-white transition">
              Entrar
            </button>
            <button onClick={() => { navigate("/cadastro"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-green-500 hover:text-white transition">
              Cadastrar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
