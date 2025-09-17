import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import logo from "../assets/logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!matricula && !email) {
      setError("Informe a matrícula ou o e-mail para continuar");
      return;
    }

    try {
      const res = await fetch("https://iflow-zdbx.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricula: matricula || undefined,
          email: email || undefined,
          password: senha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900 z-50"
      >
        <Home className="h-5 w-5 mr-1" /> Página Inicial
      </button>

      <img
        src={logo}
        alt="Logo"
        className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 h-12 w-auto z-40 object-contain"
      />

      <div className="w-full max-w-md space-y-6 mt-16">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          Fazer login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <div className="text-center text-gray-500 text-sm">ou</div>

          <input
            type="email"
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-700 text-white py-2 rounded-md"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/cadastro")}
            className="w-full text-sm text-gray-500 mt-2"
          >
            Criar uma conta
          </button>
        </form>
      </div>
    </div>
  );
}
