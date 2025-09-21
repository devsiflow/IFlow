import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import livroImg from "../assets/livro.jpg"; // imagem padrão para itens
import Loading from "../components/loading";
import { X, User, ArrowLeft } from "lucide-react";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchUserAndItems = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          navigate("/login");
          return;
        }

        const metadata = user.user_metadata || {};
        setUser({
          id: user.id,
          name: metadata.nome || "Não Informado",
          email: user.email,
          matricula: metadata.matricula || "Não informado",
          avatar_url: metadata.avatar_url || null,
        });

        setForm({
          name: metadata.name || "",
          email: user.email,
        });

        // Buscar itens do usuário
        const resItems = await fetch(
          `https://iflow-zdbx.onrender.com/items/user/${user.id}`
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

    fetchUserAndItems();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: form.name },
      });

      if (error) throw error;

      setUser({ ...user, name: form.name });
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar perfil");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  const handleUpload = async () => {
    if (!newImage) return;
    setUploading(true);
    try {
      const fileExt = newImage.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, newImage, { upsert: true });

      if (error) throw error;

      const { publicUrl, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      setUser({ ...user, avatar_url: publicUrl });
      setShowModal(false);
      setNewImage(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Botão de voltar com ícone de seta */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="relative group p-2 rounded hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity whitespace-nowrap">
            Voltar
          </span>
        </button>
      </div>

      {/* Card do usuário */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Foto de perfil com hover */}
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative w-32 h-32 group">
            {/* Ícone ou foto */}
            {!user.avatar_url ? (
              <div className="w-32 h-32 rounded-full border-4 border-green-600 shadow-md flex items-center justify-center bg-gray-100 group-hover:opacity-0 transition-opacity duration-300">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            ) : (
              <img
                src={user.avatar_url}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow-md"
              />
            )}

            {/* Hover adicionar foto */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-full cursor-pointer transition-opacity"
              onClick={() => setShowModal(true)}
            >
              <span className="text-white font-semibold text-center">
                + Adicionar Foto
              </span>
            </div>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>

          {!editing ? (
            <>
              <p>
                <strong>Nome:</strong> {user.name || "Não informado"}
              </p>
              <p>
                <strong>E-mail:</strong> {user.email}
              </p>
              <p>
                <strong>Matrícula:</strong> {user.matricula || "Não informado"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
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
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
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

      {/* Modal de upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Enviar nova foto</h2>
            <div
              className="border-dashed border-2 border-gray-400 rounded-xl h-40 flex justify-center items-center text-gray-400 cursor-pointer hover:border-green-500 hover:text-green-500"
              onClick={() => document.getElementById("fileInput").click()}
            >
              {newImage ? newImage.name : "Arraste ou clique para adicionar"}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !newImage}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:opacity-50"
            >
              {uploading ? "Enviando..." : "Salvar Foto"}
            </button>
          </div>
        </div>
      )}

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
