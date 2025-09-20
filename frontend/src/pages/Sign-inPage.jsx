import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Cadastro() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!matricula || !nome || !email || !senha) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      // 1️⃣ Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });
      if (error) return setError(error.message);

      // 2️⃣ Criar profile no backend (Prisma)
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.user.id, // UUID do Supabase
          name: nome,
          matricula,
        }),
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Criar conta</button>
    </form>
  );
}
