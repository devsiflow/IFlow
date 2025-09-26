import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import logo from "../assets/logo.jpg";

function Footer() {
  return (
    <footer
      id="contato"
      data-aos="fade-up"
      className="text-gray-300 bg-gray-900 rounded-t-3xl"
    >
      <div className="max-w-7xl mx-auto py-6 px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo e texto */}
        <div>
          <img src={logo} alt="IFlow Logo" className="w-1/2" />
          <p className="text-sm leading-relaxed mt-2">
            IFlow é um sistema desenvolvido no IFPR para organizar achados, perdidos e doações, 
            promovendo solidariedade e praticidade no dia a dia acadêmico.
          </p>
          {/* Social icons */}
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="#" className="hover:text-green-400"><FaInstagram /></a>
            <a href="#" className="hover:text-green-400"><FaTwitter /></a>
            <a href="#" className="hover:text-green-400"><FaGithub /></a>
          </div>
        </div>

        {/* Colunas de links */}
        <div>
          <h4 className="font-semibold mb-2 text-white">Geral</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/cadastro" className="hover:text-green-400">Cadastre-se</a></li>
            <li><a href="https://ifpr.edu.br/contatos" className="hover:text-green-400">Contato</a></li>
            <li><a href="https://www.google.com/maps/place/Instituto+Federal+do+Paraná+-+Campus+Curitiba/" className="hover:text-green-400">Localização</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-white">IFPR</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="https://ifpr.edu.br" className="hover:text-green-400">Site Oficial do IFPR</a></li>
            <li><a href="#sobreNos" className="hover:text-green-400">Sobre nós</a></li>
            <li><a href="https://ifpr.edu.br/acesso-a-informacao/3-participacao-social/ouvidoria" className="hover:text-green-400">Fale Conosco</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-white">IFlow</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="mailto:devsiflow@gmail.com" className="hover:text-green-400">Email para os Devs</a></li>
            <li><a href="#comoFunciona" className="hover:text-green-400">Como funciona</a></li>
            <li><a href="#sobreNos" className="hover:text-green-400">Sobre</a></li>
            <li><a href="#objetivo" className="hover:text-green-400">Nosso Objetivo</a></li>
          </ul>
        </div>
      </div>

      <hr className="border-t border-gray-700 mx-6" />

      {/* Rodapé final */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between text-sm text-gray-400">
        <span>© {new Date().getFullYear()} – Todos os Direitos Reservados</span>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-green-400">Política de Privacidade</a>
          <a href="#" className="hover:text-green-400">Termos de serviço</a>
          <a href="#" className="hover:text-green-400">Configurações de Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
