import { X } from "lucide-react";
import AnimatedLink from "./AnimatedLink";
import UserAvatar from "./UserAvatar";

export default function MenuMobile({ user, profileImage, profileImageSmall, navigate, menuOpen, setMenuOpen }) {

const scrollToSection = (id) => {
    setMenuOpen(false); 
    const section = document.querySelector(id);
    const menuHeight = 208;
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - menuHeight;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = Math.min(sectionTop, maxScroll);
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Botão Hamburguer */}
      <button className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
        <span className={`block w-8 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-8 h-0.5 bg-white rounded transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
      </button>

      <div className={`fixed top-0 right-0 w-72 h-full bg-green-950 shadow-lg p-6 flex flex-col gap-8 transform transition-transform duration-300 z-50 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 transition">
          <X className="w-6 h-6" />
        </button>

        {user && (
          <div className="flex flex-col items-center gap-2 mt-8">
            <UserAvatar profileImage={profileImage} profileImageSmall={profileImageSmall} size="lg" onClick={() => { setMenuOpen(false); navigate("/perfil"); }} />
            <p className="text-white font-semibold">{user.name}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 text-white text-22">
          <AnimatedLink href="#sobreNos" onClick={(e) => { e.preventDefault(); scrollToSection("#sobreNos"); }}>Sobre nós</AnimatedLink>
          <AnimatedLink href="#comoFunciona" onClick={(e) => { e.preventDefault(); scrollToSection("#comoFunciona"); }}>Como funciona</AnimatedLink>
          <AnimatedLink href="#objetivo" onClick={(e) => { e.preventDefault(); scrollToSection("#objetivo"); }}>Objetivo</AnimatedLink>
          <AnimatedLink href="#contato" onClick={(e) => { e.preventDefault(); scrollToSection("#contato"); }}>Contato</AnimatedLink>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button onClick={() => { navigate("/bancoitens"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22">Perdi um item</button>
          <button onClick={() => { navigate("/cadastroitem"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22">Encontrei um item</button>
        </div>

        {!user && (
          <div className="flex flex-col gap-2">
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22">Entrar</button>
            <button onClick={() => { navigate("/cadastro"); setMenuOpen(false); }} className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-green-900 transition text-22">Cadastro</button>
          </div>
        )}
      </div>
    </>
  );
}
