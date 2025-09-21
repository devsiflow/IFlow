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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchUserAndItems = async () => {
      try {
        const { data: supData, error: supError } =
          await supabase.auth.getUser();
        if (supError || !supData.user) {
          navigate("/login");
          return;
        }

        const metadata = supData.user.user_metadata || {};

        setUser({
          id: supData.user.id,
          name: metadata.name || "Não informado",
          email: supData.user.email,
          matricula: metadata.matricula || "Não informado",
          avatar_url: metadata.avatar_url || null,
        });

        setForm({ name: metadata.name || "", email: supData.user.email });

        const perfilId = localStorage.getItem("perfilId");
        if (!perfilId) {
          setItems([]);
        } else {
          const resItems = await fetch(
            `https://iflow-zdbx.onrender.com/items/user/${perfilId}`
          );
          if (resItems.ok) {
            const dataItems = await resItems.json();
            setItems(dataItems);
          }
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

  useEffect(() => {
    if (!newImage) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newImage]);

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
    localStorage.removeItem("perfilId");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewImage(file);
    }
  };

const handleUpload = async () => {
  if (!newImage) return;
  setUploading(true);

  try {
    // 1️⃣ Upload da imagem no storage
    const fileExt = newImage.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, newImage, { upsert: true });

    if (uploadError) throw uploadError;

    // 2️⃣ Pegar URL pública
    const { data: urlData, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // 3️⃣ Pegar token válido do Supabase
    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) {
      alert("Usuário não está logado");
      setUploading(false);
      return;
    }

    const token = session.access_token;

    // 4️⃣ Enviar PUT para o backend
    const res = await fetch("https://iflow-zdbx.onrender.com/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profilePic: publicUrl }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Erro ao atualizar perfil");
    }

    // 5️⃣ Atualizar state local
    setUser((prev) => ({ ...prev, avatar_url: publicUrl }));
    setShowModal(false);
    setNewImage(null);
    alert("Foto de perfil atualizada com sucesso!");
  } catch (err) {
    console.error(err);
    alert(`Erro ao enviar imagem: ${err.message}`);
  } finally {
    setUploading(false);
  }
};




  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Botão de voltar */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="relative group p-2 rounded hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Card do usuário */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative w-32 h-32 group">
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
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-full cursor-pointer transition-opacity"
              onClick={() => setShowModal(true)}
            >
              <span className="text-white font-semibold text-center">
                + Alterar Foto
              </span>
            </div>
          </div>
        </div>

        {/* Informações */}
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

      {/* Modal drag & drop */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-xl">
            <button
              onClick={() => {
                setShowModal(false);
                setNewImage(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Alterar Foto de Perfil
            </h2>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed ${
                isDragging ? "border-green-600 bg-green-50" : "border-gray-300"
              } rounded-xl p-10 flex flex-col items-center justify-center text-gray-500 cursor-pointer transition`}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg object-contain mb-4 shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <User className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-600">
                    Arraste uma imagem aqui ou{" "}
                    <span className="underline text-green-600">clique</span>
                  </p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !newImage}
              className="mt-6 w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 disabled:opacity-50"
            >
              {uploading ? "Enviando..." : "Salvar Foto"}
            </button>
          </div>
        </div>
      )}

      {/* Itens */}
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
