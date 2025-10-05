import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import meuVideo from "../../assets/video.mp4";
import meuVideo2 from "../../assets/video2.mp4";

function Footer() {
  const navigate = useNavigate();

  function NavCadastro() {
    navigate(`/cadastro`);
  }

  return (
    <footer
      id="contato"
      data-aos="fade-up"
      className="relative overflow-hidden text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-900 rounded-t-3xl"
    >
      {/* Meteoros */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-70 transform scale-0 transition duration-700"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `linear-gradient(to bottom, #22c55e, transparent)`,
              animation: `meteorFall ${2 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e descrição */}
        <div>
          <img src={logo} alt="IFlow Logo" className="w-28 md:w-32 mb-4 rounded-lg shadow-lg" />
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            IFlow organiza achados, perdidos e doações, promovendo solidariedade e praticidade no
            dia a dia acadêmico.
          </p>
          <div className="flex space-x-4 mt-4 text-xl text-gray-600 dark:text-gray-400">
            <a
              href="https://www.instagram.com/ifprcampuscuritiba"
              className="hover:text-green-500 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-500 transition-colors" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a
              href="https://github.com/devsiflow/IFlow"
              className="hover:text-green-500 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Colunas de links */}
        {[
          {
            title: "Geral",
            links: [
              { name: "Cadastre-se", onClick: NavCadastro },
              { name: "Contato", href: "https://ifpr.edu.br/contatos" },
              { name: "Localização", href: "https://maps.app.goo.gl/3891w8W8rQSgj99S8", target: "_blank" },
            ],
          },
          {
            title: "IFPR",
            links: [
              { name: "Site Oficial do IFPR", href: "https://ifpr.edu.br" },
              { name: "Sobre nós", href: "#sobreNos" },
              { name: "Fale Conosco", href: "https://ifpr.edu.br/acesso-a-informacao/3-participacao-social/ouvidoria" },
            ],
          },
          {
            title: "IFlow",
            links: [
              { name: "Email para os Devs", href: "mailto:devsiflow@gmail.com" },
              { name: "Como funciona", href: "#comoFunciona" },
              { name: "Sobre", href: "#sobreNos" },
              { name: "Nosso Objetivo", href: "#objetivo" },
            ],
          },
        ].map((col, idx) => (
          <div key={idx}>
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link, i) => (
                <li key={i}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.target || "_self"}
                      className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <button
                      onClick={link.onClick}
                      className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <hr className="border-t border-gray-300 dark:border-gray-700 mx-6" />

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
        <button
          onClick={() => window.open(meuVideo, "_blank")}
          className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          ©
        </button>{" "}
        {new Date().getFullYear()} – Todos os Direitos Reservado<span>
        <button
          onClick={() => window.open(meuVideo2, "_blank")}
          className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          s
        </button>{" "}
      </span>
      </span>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
            Termos de serviço
          </a>
          <a href="#" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
            Configurações de Cookies
          </a>
        </div>
      </div>

      {/* Keyframes de meteoro */}
      <style>
        {`
          @keyframes meteorFall {
            0% {
              transform: translateY(-100px) translateX(0) rotate(45deg);
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            100% {
              transform: translateY(600px) translateX(200px) rotate(45deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
