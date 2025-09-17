import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";

function Menu() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Buscar nome do usuário se houver token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://iflow-zdbx.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  function NavCadastroItem() {
    navigate("/cadastroitem");
  }

  function NavInicio() {
    navigate("/home");
  }

  function NavPerfil() {
    navigate("/perfil");
  }

  return (
    <nav className="bg-green-950 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo e Links lado a lado */}
      <div className="flex items-center space-x-5">
        <img src={logo} alt="Logo" className="w-36" />
        <button onClick={NavInicio} className="text-white font-bold">
          Início
        </button>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-4">
        <button
          onClick={NavCadastroItem}
          className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          Cadastrar Item
        </button>

        <button
          onClick={NavPerfil}
          className="bg-green-500 transition-colors duration-500 hover:bg-green-400 text-white font-semibold px-4 py-1 rounded"
        >
          {userName ? userName : "Perfil"}
        </button>
      </div>
    </nav>
  );
}

export default Menu;
