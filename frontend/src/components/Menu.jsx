import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.jpg";
import { User, X } from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // big avatar
  const [profileImageSmall, setProfileImageSmall] = useState(null); // menu avatar (small)
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
          name:
            cachedName || supData.user.user_metadata?.name || "Não informado",
          email: supData.user.email,
        });

        if (cachedPic) setProfileImage(cachedPic);
        if (cachedPicSmall) setProfileImageSmall(cachedPicSmall);

        const session = (await supabase.auth.getSession())?.data?.session;
        const token = session?.access_token;
        if (!token) return;

        try {
          const res = await fetch("https://iflow-zdbx.onrender.com/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const profile = await res.json();
            if (profile?.profilePic && profile.profilePic !== cachedPic) {
              setProfileImage(profile.profilePic);
              localStorage.setItem("profilePic", profile.profilePic);
            }
            if (
              profile?.profilePicSmall &&
              profile.profilePicSmall !== cachedPicSmall
            ) {
              setProfileImageSmall(profile.profilePicSmall);
              localStorage.setItem("profilePicSmall", profile.profilePicSmall);
            }
            if (profile?.name && profile.name !== cachedName) {
              setUser((u) => ({ ...u, name: profile.name }));
              localStorage.setItem("profileName", profile.name);
            }
          }
        } catch (err) {
          console.debug("Menu: background profile sync failed", err);
        }
      } catch (err) {
        console.error("Menu error:", err);
      }
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
    <a {...props} className="relative group">
      <span className="inline-block">{children}</span>
      <span className="absolute bottom-[-2px] left-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
    </a>
  );

  return (
    <nav className="fixed top-0 left-0 w-full text-white z-50 bg-[linear-gradient(to_bottom,rgb(0,0,0),rgba(0,0,0,0))]">

      <div className="flex items-center justify-between px-6 py-3">
        <img
          src={logo}
          alt="Logo"
          className="w-32 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <ul className="hidden md:flex space-x-8 font-medium text-xl">
          <li>
            <AnimatedLink href="#sobreNos">Sobre nós</AnimatedLink>
          </li>
          <li>
            <AnimatedLink href="#comoFunciona">Como funciona</AnimatedLink>
          </li>
          <li>
            <AnimatedLink href="#objetivo">Objetivo</AnimatedLink>
          </li>
          <li>
            <AnimatedLink href="#contato">Contato</AnimatedLink>
          </li>
          <li>
            <button
              onClick={() => navigate("/bancoitens")}
              className="relative group text-22"
            >
              <span className="inline-block">Perdi um item</span>
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/cadastroitem")}
              className="relative group text-22"
            >
              <span className="inline-block">Encontrei um item</span>
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
            </button>
          </li>
        </ul>

        {/* Avatar desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:underline font-bold"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/cadastro")}
                className="hover:underline"
              >
                Cadastrar
              </button>
            </>
          ) : profileImageSmall ? (
            <img
              src={profileImageSmall}
              alt="Foto do usuário"
              className="w-9 h-9 rounded-full border border-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
              onClick={() => {
                navigate("/perfil");
              }}
            />
          ) : profileImage ? (
            <img
              src={profileImage}
              alt="Foto do usuário"
              className="w-9 h-9 rounded-full border border-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
              onClick={() => {
                navigate("/perfil");
              }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full border border-white flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-110"
              onClick={() => navigate("/perfil")}
            >
              <User className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>

        {/* Botão hambúrguer */}
        <button
          className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2.5" : ""
            }`}
          />
          <span
            className={`block w-8 h-0.5 bg-white rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-green-950 shadow-lg p-6 flex flex-col gap-8 transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {user && (
          <div className="flex flex-col items-center gap-2 mt-8">
            {profileImageSmall ? (
              <img
                src={profileImageSmall}
                alt="perfil"
                className="w-16 h-16 rounded-full border-2 border-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/perfil");
                }}
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="perfil"
                className="w-16 h-16 rounded-full border-2 border-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/perfil");
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/perfil");
                }}
              >
                <User className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <p className="text-white font-semibold">{user.name}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 text-white text-22">
          <AnimatedLink href="#sobreNos" onClick={() => setMenuOpen(false)}>
            Sobre nós
          </AnimatedLink>
          <AnimatedLink href="#comoFunciona" onClick={() => setMenuOpen(false)}>
            Como funciona
          </AnimatedLink>
          <AnimatedLink href="#objetivo" onClick={() => setMenuOpen(false)}>
            Objetivo
          </AnimatedLink>
          <AnimatedLink href="#contato" onClick={() => setMenuOpen(false)}>
            Contato
          </AnimatedLink>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={() => {
              navigate("/bancoitens");
              setMenuOpen(false);
            }}
            className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22"
          >
            Perdi um item
          </button>
          <button
            onClick={() => {
              navigate("/cadastroitem");
              setMenuOpen(false);
            }}
            className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22"
          >
            Encontrei um item
          </button>
        </div>

        {!user && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22"
            >
              Entrar
            </button>
            <button
              onClick={() => {
                navigate("/cadastro");
                setMenuOpen(false);
              }}
              className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22"
            >
              Cadastro
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
