import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  function NavCadastro() {
    navigate(`/cadastro`);
  }

  return (
    <footer
      id="contato"
      data-aos="fade-up"
      className="relative overflow-hidden text-gray-700 bg-slate-100 rounded-t-3xl"
    >
      {/* Meteoros */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-70 transform scale-0 group-hover:scale-100 transition duration-700"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `meteorFall ${
                2 + Math.random() * 3
              }s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e descrição */}
        <div>
          <img src={logo} alt="IFlow Logo" className="w-32 mb-4" />
          <p className="text-sm leading-relaxed">
            IFlow é um sistema desenvolvido no IFPR para organizar achados,
            perdidos e doações, promovendo solidariedade e praticidade no dia a
            dia acadêmico.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a
              href="https://www.instagram.com/ifprcampuscuritiba"
              className="hover:text-green-600 transition"
            >
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-600 transition">
              <FaTwitter />
            </a>
            <a
              href="https://github.com/devsiflow/IFlow"
              className="hover:text-green-600 transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Colunas de links */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Geral</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={NavCadastro} className="hover:text-green-600">
                Cadastre-se
              </button>
            </li>
            <li>
              <a
                href="https://ifpr.edu.br/contatos"
                className="hover:text-green-600"
              >
                Contato
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://maps.app.goo.gl/3891w8W8rQSgj99S8"
                className="hover:text-green-600"
              >
                Localização
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">IFPR</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://ifpr.edu.br" className="hover:text-green-600">
                Site Oficial do IFPR
              </a>
            </li>
            <li>
              <a href="#sobreNos" className="hover:text-green-600">
                Sobre nós
              </a>
            </li>
            <li>
              <a
                href="https://ifpr.edu.br/acesso-a-informacao/3-participacao-social/ouvidoria"
                className="hover:text-green-600"
              >
                Fale Conosco
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">IFlow</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:devsiflow@gmail.com"
                className="hover:text-green-600"
              >
                Email para os Devs
              </a>
            </li>
            <li>
              <a href="#comoFunciona" className="hover:text-green-600">
                Como funciona
              </a>
            </li>
            <li>
              <a href="#sobreNos" className="hover:text-green-600">
                Sobre
              </a>
            </li>
            <li>
              <a href="#objetivo" className="hover:text-green-600">
                Nosso Objetivo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-t border-gray-300 mx-6" />

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <span>© {new Date().getFullYear()} – Todos os Direitos Reservados</span>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-green-600">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-green-600">
            Termos de serviço
          </a>
          <a href="#" className="hover:text-green-600">
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
