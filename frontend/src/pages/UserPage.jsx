import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loadingGif from "../assets/pedreiro.gif";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // Se não tiver token, redireciona para login
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://iflow-zdbx.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Se o token for inválido ou outro erro, remove token e vai pro login
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

 if (loading) {
       return (
     <div className="p-6 text-center flex justify-center items-center min-h-screen min-w-screen">
       <img src={loadingGif} alt="Carregando..." className="w-[300px] h-[300px]" />
     </div>
   );
   }
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null; // não deve acontecer, mas previne crash

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl font-semibold mb-6">Perfil do Usuário</h1>
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-md shadow-md space-y-4">
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>E-mail:</strong> {user.email}
        </p>
        <p>
          <strong>Matrícula:</strong> {user.matricula}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-md mt-4"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
