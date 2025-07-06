import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.jpg";


function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function NavLogin() {
    navigate(`/login`);
  }

  const handleGoogleLogin = () => {
    console.log("Login com Google");
    // lógica real de login com Google entra aqui
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email enviado:", email);
    // lógica real para enviar e-mail entra aqui
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <img
        src={logo} // seu arquivo de logo
        alt="Logo"
        className="fixed top-0 left-0 mb-4 mr-4 h-12 w-auto z-50 object-contain"
      />
      <div className="w-full max-w-md space-y-6">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Use o Google ou seu e-mail institucional.
          </p>
        </div>

        {/* Botão Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Entrar com Google
        </button>

        {/* Divisor */}
        <div className="flex items-center">
          <div className="w-full h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-400">ou</span>
          <div className="w-full h-px bg-gray-300" />
        </div>

        {/* Campo de e-mail */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail institucional
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="seunome@ifpr.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#066c06]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#084808] hover:bg-[#066c06] text-white py-2 rounded-md text-sm font-medium transition"
          >
            Continuar com e-mail
          </button>

          <button
            type="button"
            onClick={NavLogin}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition text-center mt-2"
          >
            Voltar para login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
