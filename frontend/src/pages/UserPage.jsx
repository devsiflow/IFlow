// pages/UserPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import livroImg from "../assets/livro.jpg";
import { X, User, ArrowLeft, Trash2, Moon, Sun } from "lucide-react";
import LogoLoader from "../components/LogoLoader";

export default function UserPage() {
  const navigate = useNavigate();

  // estado original
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Tema: implementado localmente para não quebrar efeitos existentes
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Erro ao aplicar tema:", e);
    }
  }, [theme]);

  // Fetch user and items (mantive sua lógica)
  useEffect(() => {
    let mounted = true;
    const fetchUserAndItems = async () => {
      try {
        setLoading(true);
        const { data: supData, error: supError } = await supabase.auth.getUser();
        if (supError || !supData?.user) {
          navigate("/login");
          return;
        }

        const metadata = supData.user.user_metadata || {};
        const session = (await supabase.auth.getSession())?.data?.session;
        const token = session?.access_token;

        const cachedPic = localStorage.getItem("profilePic");

        let profileData = {};
        if (token) {
          try {
            const res = await fetch("https://iflow-zdbx.onrender.com/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) profileData = await res.json();
          } catch (err) {
            console.error("Erro ao buscar perfil:", err);
          }
        }

        if (!mounted) return;

        setUser({
          id: supData.user.id,
          name: profileData?.name || metadata.name || "Não informado",
          email: supData.user.email,
          matricula: metadata.matricula || "Não informado",
          avatar_url: profileData?.profilePic || cachedPic || null,
        });

        setForm({ name: metadata.name || "", email: supData.user.email });

        if (token) {
          try {
            const resItems = await fetch("https://iflow-zdbx.onrender.com/items/me/items", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resItems.ok) {
              const data = await resItems.json();
              if (mounted) setItems(data);
            } else {
              console.error("Erro ao buscar itens:", await resItems.text());
            }
          } catch (err) {
            console.error("Erro fetch items:", err);
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Erro de conexão com o servidor");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserAndItems();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Preview imagem
  useEffect(() => {
    if (!newImage) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newImage]);

  // Atualizar perfil
  const handleUpdate = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ data: { name: form.name } });
      if (error) throw error;
      setUser((prev) => ({ ...prev, name: form.name }));
      setEditing(false);
      setMessage("✅ Perfil atualizado com sucesso!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao atualizar perfil");
      setMessageType("error");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      localStorage.removeItem("profilePic");
      localStorage.removeItem("profileName");
      navigate("/login");
    }
  };

  // Upload handlers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setNewImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) setNewImage(file);
  };

  const handleUpload = async () => {
    if (!newImage || !user) return;
    setUploading(true);
    setMessage("");
    try {
      const thumbFile = newImage;
      const fileExt = (thumbFile.name || newImage.name).split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, thumbFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData, error: urlError } = supabase.storage.from("avatars").getPublicUrl(fileName);
      if (urlError) throw urlError;

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const session = (await supabase.auth.getSession())?.data?.session;
      if (!session) throw new Error("Usuário não está logado");
      const token = session.access_token;

      const res = await fetch("https://iflow-zdbx.onrender.com/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profilePic: publicUrl }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      setUser((prev) => ({ ...prev, avatar_url: publicUrl }));
      localStorage.setItem("profilePic", publicUrl);
      localStorage.setItem("profileName", form.name || user.name || "");
      setShowModal(false);
      setNewImage(null);
      setMessage("✅ Foto de perfil atualizada com sucesso!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(`❌ Erro ao enviar imagem: ${err?.message || err}`);
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  // Deletar item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Tem certeza que deseja remover este item?")) return;
    try {
      const session = (await supabase.auth.getSession())?.data?.session;
      if (!session) throw new Error("Usuário não autenticado");
      const token = session.access_token;
      const res = await fetch(`https://iflow-zdbx.onrender.com/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao remover item");
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setMessage("✅ Item removido com sucesso!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao remover item: " + (err?.message || err));
      setMessageType("error");
    }
  };

  if (loading) return <LogoLoader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden py-12 px-6 transition-colors duration-300">
      {/* Botão de tema (sempre visível) */}
      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-md"
        aria-label="Alternar tema"
        title="Alternar tema claro/escuro"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>

      {/* Meteoros de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="meteor absolute bg-gradient-to-r from-white to-gray-400 w-1 h-24 rounded-full opacity-50 animate-meteor"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Botão voltar */}
      <div className="flex items-center mb-6 relative z-10">
        <button onClick={() => navigate(-1)} className="group p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-md">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Mensagem */}
      {message && (
        <div className={`max-w-4xl mx-auto mb-4 p-4 rounded-md font-medium text-center text-white shadow-lg ${messageType === "success" ? "bg-green-600" : "bg-red-600"} transition relative z-10`}>
          {message}
        </div>
      )}

      {/* Perfil */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 relative z-10 border border-gray-200 dark:border-gray-700 hover:shadow-[0_0_40px_rgba(0,255,255,0.08)] transition-transform transform hover:-translate-y-1">
        {/* Avatar */}
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative w-32 h-32 group">
            {!user.avatar_url ? (
              <div className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-md flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:opacity-0 transition-opacity duration-300">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            ) : (
              <img src={user.avatar_url} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-md" />
            )}
            <div className="absolute inset-0 bg-cyan-500/40 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-full cursor-pointer transition-opacity" onClick={() => setShowModal(true)}>
              <span className="text-white font-semibold text-center">+ Alterar Foto</span>
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">Meu Perfil</h1>
          {!editing ? (
            <>
              <p className="text-gray-700 dark:text-gray-300"><strong>Nome:</strong> {user.name || "Não informado"}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>E-mail:</strong> {user.email}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Matrícula:</strong> {user.matricula || "Não informado"}</p>
              <div className="flex gap-3 mt-4">
                <button className="px-5 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-shadow shadow-md hover:shadow-lg" onClick={() => setEditing(true)}>Editar Perfil</button>
                <button className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-shadow shadow-md hover:shadow-lg" onClick={handleLogout}>Sair</button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-md border-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:outline-none dark:bg-gray-700 dark:text-gray-100" placeholder="Nome" />
              <input type="email" value={form.email} disabled className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-300" />
              <div className="flex gap-3">
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">Salvar</button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl relative shadow-2xl">
            <button onClick={() => { setShowModal(false); setNewImage(null); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">Alterar Foto de Perfil</h2>
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
              className={`w-full border-2 border-dashed ${isDragging ? "border-cyan-400 bg-cyan-50" : "border-gray-300 dark:border-gray-600"} rounded-xl p-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 cursor-pointer transition`}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain mb-4 shadow-lg" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setNewImage(null); setPreviewUrl(null); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition">Remover imagem</button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <User className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">Arraste uma imagem aqui ou <span className="underline text-cyan-500">clique</span></p>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <button onClick={handleUpload} disabled={uploading || !newImage} className="mt-6 w-full py-3 bg-cyan-500 text-white font-medium rounded-xl hover:bg-cyan-400 disabled:opacity-50">
              {uploading ? "Enviando..." : "Salvar Foto"}
            </button>
          </div>
        </div>
      )}

      {/* Meus Itens */}
      <div className="max-w-4xl mx-auto mt-12 relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">📦 Meus Itens</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-transform transform hover:-translate-y-1 p-4 flex flex-col border-cyan-200 dark:border-gray-700">
                <img src={item.imageUrl || livroImg} alt={item.title} className="w-full h-36 object-contain mb-3 cursor-pointer rounded-lg" onClick={() => navigate(`/item/${item.id}`)} />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-md ${item.status === "Perdido" ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>{item.status}</span>
                <button onClick={() => handleDeleteItem(item.id)} className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition">
                  <Trash2 className="w-4 h-4" /> Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Você ainda não cadastrou nenhum item.</p>
        )}
      </div>

      {/* Meteor Tailwind Animations */}
      <style>{`
        @keyframes meteor {
          0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(500px) translateY(500px) rotate(360deg); opacity: 0; }
        }
        .animate-meteor {
          animation-name: meteor;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
