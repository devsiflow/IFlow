import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { User, X } from "lucide-react";
import logo from "../assets/logo.jpg";

export default function MenuBancoItens() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageSmall, setProfileImageSmall] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const cachedPic = localStorage.getItem("profilePic");
      const cachedPicSmall = localStorage.getItem("profilePicSmall");
      const cachedName = localStorage.getItem("profileName");

      const { data: supData } = await supabase.auth.getUser();
      if (!supData?.user) {
        setUser(null);
        setProfileImage(null);
        setProfileImageSmall(null);
        return;
      }

      setUser({
        id: supData.user.id,
        name: cachedName || supData.user.user_metadata?.name || "Não informado",
        email: supData.user.email,
      });

      if (cachedPic) setProfileImage(cachedPic);
      if (cachedPicSmall) setProfileImageSmall(cachedPicSmall);
    };

    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      localStorage.removeItem("profilePic");
      localStorage.removeItem("profilePicSmall");
      localStorage.removeItem("profileName");
      fetchUser();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const AnimatedLink = ({ children, ...props }) => (
    <button
      {...props}
      className="relative group text-left text-white text-xl font-medium hover:text-green-400 transition-colors"
    >
      <span className="inline-block">{children}</span>
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-400 transition-all duration-300 group-hover:w-full"></span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-950 text-white shadow z-[1000]">
      <div className="flex items-center justify-between px-6 py-3">
        <img
          src={logo}
          alt="Logo"
          className="w-36 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <ul className="hidden md:flex ml-8 space-x-8">
          <li>
            <AnimatedLink onClick={() => navigate("/")}>Início</AnimatedLink>
          </li>
          <li>
            <AnimatedLink onClick={() => navigate("/cadastroitem")}>Cadastrar Item</AnimatedLink>
          </li>
        </ul>

        <div className="hidden md:flex items-center ml-auto space-x-4">
          {user ? (
            <div className="relative group">
              {profileImageSmall || profileImage ? (
                <img
                  src={profileImageSmall || profileImage}
                  alt="Foto do usuário"
                  className="w-10 h-10 rounded-full border border-green-400 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={() => navigate("/perfil")}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full border border-green-400 flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={() => navigate("/perfil")}
                >
                  <User className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-28px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {user.name}
              </span>
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="hover:underline text-lg">
                Entrar
              </button>
              <button onClick={() => navigate("/cadastro")} className="hover:underline text-lg">
                Cadastro
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`block w-8 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      <div className={`fixed top-0 right-0 w-72 h-full bg-green-950 shadow-lg p-6 flex flex-col gap-8 transform transition-transform duration-300 z-[1000] ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white hover:text-green-400 transition">
          <X className="w-6 h-6" />
        </button>

        {user && (
          <div className="flex flex-col items-center gap-2 mt-8">
            {profileImageSmall || profileImage ? (
              <img
                src={profileImageSmall || profileImage}
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
          <AnimatedLink onClick={() => { navigate("/"); setMenuOpen(false); }}>Início</AnimatedLink>
          <AnimatedLink onClick={() => { navigate("/cadastroitem"); setMenuOpen(false); }}>Cadastrar Item</AnimatedLink>
        </div>

        {!user && (
          <div className="flex flex-col gap-2 mt-auto">
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-green-500 hover:text-white transition">
              Entrar
            </button>
            <button onClick={() => { navigate("/cadastro"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-green-500 hover:text-white transition">
              Cadastro
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
