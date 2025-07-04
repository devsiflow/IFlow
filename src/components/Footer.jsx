import { FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';


function Footer() {
  return (
    <footer className=" text-[#1F1F1F] rounded-t-3xl mt-20">
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo e texto */}
        <div>
          <img src="/logo-iflow.png" alt="IFlow Logo" className="h-10 mb-4" />
          <p className="text-sm leading-relaxed">
            Lorem ipsum dolor sit amet. Sit reiciendis velit a harum alias et nihil
            expedita sit libero magnam ut deleniti reiciendis 33 exercitationem rerum.
            Sit dolores pariatur id galisum cupiditate non sapiente vitae qui nesciunt
            voluptas a nihil tot.
          </p>
          {/* Social icons */}
          <div className="flex space-x-4 mt-6 text-xl">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaGithub /></a>
          </div>
        </div>

        {/* Colunas de links */}
        <div>
          <h4 className="font-semibold mb-3">Geral</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Cadastre-se</a></li>
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Localização</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Geral</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Cadastre-se</a></li>
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Localização</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Geral</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Cadastre-se</a></li>
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Localização</a></li>
          </ul>
        </div>
      </div>

      <hr className="border-t border-[#1F1F1F] mx-6" />

      {/* Rodapé final */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-[#666]">
        <span>© {new Date().getFullYear()} – Todos os Direitos Reservados</span>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de serviço</a>
          <a href="#">Configurações de Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;