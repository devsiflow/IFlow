import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import logo from "../assets/logo.jpg";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Informe email e senha para continuar");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) return setError(error.message);

      // Buscar perfil no backend
      const API_URL = import.meta.env.VITE_API_URL;
      const profileRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const profile = await profileRes.json();

      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(profile));
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
        <h1 className="text-3xl font-semibold text-gray-900 text-center">Fazer login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
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
