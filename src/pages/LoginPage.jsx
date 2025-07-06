import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Login() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function NavCadastro() {
    navigate("/cadastro");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { matricula, email, senha });
    // lógica de autenticação aqui
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <img
        src={logo} // seu arquivo de logo
        alt="Logo"
        className="fixed top-0 left-0 mb-4 mr-4 h-12 w-auto z-50 object-contain"
      />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Fazer login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Acesse com suas credenciais institucionais
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-[#084808] hover:bg-[#066c06] text-white py-2 rounded-md text-sm font-medium transition"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={NavCadastro}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition text-center mt-2"
          >
            Criar uma conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
