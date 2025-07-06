import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <img
        src={logo} // seu arquivo de logo
        alt="Logo"
        className="fixed top-0 left-0 mb-4 mr-4 h-12 w-auto z-50 object-contain"
      />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Bem-vindo ao IFlow!
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-green-500 hover:bg-green-400 text-white py-3 font-semibold rounded-xl text-lg h transition"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/cadastro")}
          className="w-full bg-green-500 hover:bg-green-400 text-white py-3 font-semibold rounded-xl text-lg transition"
        >
          Cadastro
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-500 hover:bg-green-400 text-white py-3 font-semibold rounded-xl text-lg transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
