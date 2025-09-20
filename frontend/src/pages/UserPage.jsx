import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg"; // imagem padrão para itens
import Loading from "../components/loading";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Dados do usuário
        const resUser = await fetch("https://iflow-zdbx.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resUser.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const dataUser = await resUser.json();
        setUser(dataUser);
        setForm({ name: dataUser.name, email: dataUser.email });

        // Itens do usuário
        const resItems = await fetch(
          `https://iflow-zdbx.onrender.com/items/user/${dataUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resItems.ok) {
          const dataItems = await resItems.json();
          setItems(dataItems);
        }
      } catch (err) {
        console.error(err);
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://iflow-zdbx.onrender.com/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setEditing(false);
      } else {
        alert("Erro ao atualizar perfil");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return Loading();
  }
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Card do usuário */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src="https://via.placeholder.com/150"
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow-md"
          />
          <button className="mt-4 text-sm text-green-700 hover:underline">
            Alterar foto
          </button>
        </div>

        {/* Informações do usuário */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>

          {!editing ? (
            <>
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>E-mail:</strong> {user.email}
              </p>
              <p>
                <strong>Matrícula:</strong> {user.matricula}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Nome"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="E-mail"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meus itens */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Meus Itens</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl shadow-sm bg-white hover:shadow-md transition p-4"
              >
                <img
                  src={item.imageUrl || livroImg}
                  alt={item.title}
                  className="w-full h-32 object-contain mb-3"
                />
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                    item.status === "Perdido"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Você ainda não cadastrou nenhum item.</p>
        )}
      </div>
    </div>
  );
}
