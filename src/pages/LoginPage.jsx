import React from "react";
import Menu from "../components/MenuOtherPages";
import bg from "../assets/backgroundImage.jpg"; // use o mesmo fundo da tela de cadastro
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  function NavCadastro() {
    navigate(`/cadastro`);
  }
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Menu />

      {/* Card centralizado */}
      <div className="flex justify-center items-center min-h-[calc(100vh-56px)]">
        <div className="bg-gray-200 rounded-2xl p-8 w-96 shadow-md">
          <h2 className="text-center text-lg font-bold mb-6">Login</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Digite sua Matrícula..."
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="email"
              placeholder="Digite Seu email Institucional..."
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="password"
              placeholder="Digite Sua senha..."
              className="w-full px-4 py-2 rounded border"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Login
            </button>

            <button
              onClick={NavCadastro}
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
