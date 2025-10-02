import AnimatedLink from "./AnimatedLink";
import UserAvatar from "./UserAvatar";

export default function MenuDesktop({
  user,
  profileImage,
  profileImageSmall,
  navigate,
}) {
  return (
    <>
      <ul className="hidden md:flex space-x-8 text-xl">
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

      <div className="hidden md:flex items-center space-x-4">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="hover:underline text-lg"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/cadastro")}
              className="hover:underline text-lg"
            >
              Cadastrar
            </button>
          </>
        ) : (
          <UserAvatar
            profileImage={profileImage}
            profileImageSmall={profileImageSmall}
            profileName={user?.name}
            size="md"
            onClick={() => navigate("/perfil")}
          />
        )}
      </div>
    </>
  );
}
