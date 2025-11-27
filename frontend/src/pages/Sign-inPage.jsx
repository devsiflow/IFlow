import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.jpg";
import { supabase } from "../lib/supabaseClient";

export default function Cadastro() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [campusId, setCampusId] = useState("");
  const [campusList, setCampusList] = useState([]);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Buscar campus ao carregar
  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const res = await fetch(`${API_URL}/campus`);
        const data = await res.json();

        let lista = [];

        if (Array.isArray(data)) {
          lista = data;
        } else if (Array.isArray(data.campus)) {
          lista = data.campus;
        } else if (Array.isArray(data.data)) {
          lista = data.data;
        }

        setCampusList(lista);
      } catch (err) {
        console.error("Erro ao carregar campus:", err);
      }
    };

    fetchCampus();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!matricula || !nome || !email || !senha || !campusId) {
      return setError("Todos os campos são obrigatórios");
    }

    if (senha !== confirmSenha) {
      return setError("As senhas não coincidem");
    }

    try {
      setLoading(true);

      // Criar usuário no Supabase Auth
      const { data, error: supError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            name: nome,
            matricula: matricula,
            campusId: campusId
          }
        }
      });

      if (supError) {
        setLoading(false);
        return setError(supError.message);
      }

      if (!data.user) {
        setLoading(false);
        return setError("Usuário não retornou do Supabase");
      }

      const userId = data.user.id;

      // Criar profile manualmente
      const profileRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          nome: nome,
          matricula: matricula,
          campusId: parseInt(campusId),
        }),
      });

      if (!profileRes.ok) {
        const errData = await profileRes.json();
        throw new Error(errData.error || "Erro ao criar perfil");
      }

      setLoading(false);
      setSuccess(true);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Erro ao criar usuário: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 p-2 rounded hover:bg-gray-200 transition group"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <img
        src={logo}
        alt="Logo"
        className="fixed top-4 left-1/2 transform -translate-x-1/2 h-12 w-auto z-40 object-contain"
      />

      <div className="w-full max-w-md space-y-6 mt-20">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          Criar conta
        </h1>

        {success ? (
          <div className="p-4 bg-green-100 border border-green-400 rounded-md text-green-800 text-center">
            Conta criada com sucesso! Verifique seu e-mail para ativar a conta.
            <button
              onClick={() => navigate("/login")}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Ir para login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
              autoFocus
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
              disabled={loading}
            />

            <input
              type="email"
              placeholder="E-mail institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
              disabled={loading}
            />

            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white"
              required
              disabled={loading || campusList.length === 0}
            >
              <option value="">Selecione seu campus</option>
              {campusList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            {/* SENHA */}
            <div className="relative">
              <input
                type={showSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="relative">
              <input
                type={showConfirmSenha ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmSenha(!showConfirmSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                {showConfirmSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* BOTÃO COM LOADER */}
            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Criar conta"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-gray-500 mt-2"
              disabled={loading}
            >
              Voltar para login
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
