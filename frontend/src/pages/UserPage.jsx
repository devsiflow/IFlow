import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { X, User, ArrowLeft, Trash2, Moon, Sun } from "lucide-react";
import LogoLoader from "../components/LogoLoader";
import { useTheme } from "../context/ThemeContext";
import livroImg from "../assets/livro.jpg";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import { Package } from 'lucide-react';

// Função para gerar recorte da imagem (mantida igual)
async function generateCroppedImage(file, crop = null, maxSize = 400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");

      let cropX = 0;
      let cropY = 0;
      let cropWidth = img.width;
      let cropHeight = img.height;

      if (crop) {
        cropX = crop.x;
        cropY = crop.y;
        cropWidth = crop.width;
        cropHeight = crop.height;
      }

      let finalWidth = cropWidth;
      let finalHeight = cropHeight;

      if (finalWidth > finalHeight) {
        if (finalWidth > maxSize) {
          finalHeight *= maxSize / finalWidth;
          finalWidth = maxSize;
        }
      } else {
        if (finalHeight > maxSize) {
          finalWidth *= maxSize / finalHeight;
          finalHeight = maxSize;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        finalWidth,
        finalHeight
      );

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.8
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

// Componente de Partícula para o fundo
const FloatingParticle = ({ index }) => {
  const colors = [
    "from-cyan-400/30 to-blue-500/30",
    "from-purple-400/30 to-pink-500/30",
    "from-emerald-400/30 to-teal-500/30",
    "from-amber-400/30 to-orange-500/30",
    "from-violet-400/30 to-purple-500/30",
  ];

  const sizes = [
    { width: 120, height: 4 },
    { width: 80, height: 3 },
    { width: 200, height: 2 },
    { width: 150, height: 5 },
    { width: 100, height: 4 },
  ];

  const color = colors[index % colors.length];
  const size = sizes[index % sizes.length];

  return (
    <motion.div
      className={`absolute bg-gradient-to-r ${color} rounded-full blur-[1px]`}
      style={{
        width: size.width,
        height: size.height,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        rotate: Math.random() * 360,
      }}
      initial={{
        opacity: 0,
        x: -100,
        scale: 0.8,
      }}
      animate={{
        opacity: [0, 0.8, 0],
        x: [0, 500, -500],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 180, 360],
        transition: {
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        },
      }}
    />
  );
};

// Componente de Bolha Flutuante
const FloatingBubble = ({ index }) => {
  const sizes = [40, 60, 80, 100, 120];
  const opacities = [0.1, 0.15, 0.2, 0.25];

  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-sm border border-cyan-300/30"
      style={{
        width: sizes[index % sizes.length],
        height: sizes[index % sizes.length],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: opacities[index % opacities.length],
      }}
      initial={{
        y: 100,
        scale: 0,
      }}
      animate={{
        y: [-100, 100, -100],
        x: [0, Math.random() * 50 - 25, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        transition: {
          duration: 20 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 8,
        },
      }}
    />
  );
};

// Componente de Efeito de Luz
const LightBeam = ({ index }) => {
  return (
    <motion.div
      className="absolute bg-gradient-to-b from-cyan-200/10 via-transparent to-transparent"
      style={{
        width: 2,
        height: 300,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        x: [0, Math.random() * 200 - 100],
        transition: {
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3,
        },
      }}
    />
  );
};

export default function UserPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";

  const fetchMyItems = async (token, userId) => {
    try {
      // Primeiro busca todos os itens
      const res = await fetch(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const allItems = data.items || [];

        // Filtra apenas os itens do usuário atual
        const myItems = allItems.filter((item) => item.userId === userId);
        console.log(
          "🎯 Itens filtrados:",
          myItems.length,
          "de",
          allItems.length
        );
        return myItems;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      return [];
    }
  };

  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height, x, y } = crop;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas vazio"));
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          resolve(file);
        }, "image/jpeg");
      };
      image.onerror = reject;
    });
  };

  // Buscar usuário e itens (mantido igual)
  useEffect(() => {
    let mounted = true;
    const fetchUserAndItems = async () => {
      try {
        setLoading(true);
        const { data: supData, error: supError } =
          await supabase.auth.getUser();
        if (supError || !supData?.user) {
          navigate("/login");
          return;
        }

        const session = (await supabase.auth.getSession())?.data?.session;
        const token = session?.access_token;

        let profileData = {};
        if (token) {
          try {
            const res = await fetch(`${API_URL}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) profileData = await res.json();
          } catch (err) {
            console.error("Erro ao buscar perfil:", err);
          }
        }

        if (!mounted) return;

        const metadata = supData.user.user_metadata || {};

        setUser({
          id: supData.user.id,
          name: profileData?.name || metadata.name || "Não informado",
          email: supData.user.email,
          matricula: metadata.matricula || "Não informado",
          avatar_url: profileData?.profilePic || null,
        });

        setForm({ name: metadata.name || "", email: supData.user.email });

        if (token) {
          try {
            // 🔥 AGORA USA A FUNÇÃO fetchMyItems
            console.log("🔄 Buscando itens do usuário:", supData.user.id);
            const myItems = await fetchMyItems(token, supData.user.id);

            console.log("✅ Itens carregados:", myItems.length);
            if (mounted) setItems(myItems);
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

  // Preview imagem (mantido igual)
  useEffect(() => {
    if (!newImage) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newImage]);

  // Restante das funções mantidas iguais...
  const handleUpdate = async () => {
  try {
    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) throw new Error("Usuário não autenticado");
    
    const token = session.access_token;

    // 🔥 1. Atualizar APENAS no Profile
    const API_URL = import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";
    const response = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        // matricula: form.matricula // se quiser atualizar matrícula também
      }),
    });

    if (!response.ok) throw new Error("Erro ao atualizar perfil");

    const updatedProfile = await response.json();

    // 🔥 2. Atualizar estado com dados do Profile
    setUser(prev => ({
      ...prev,
      name: updatedProfile.name,
      matricula: updatedProfile.matricula
    }));

    setEditing(false);
    setMessage("✅ Perfil atualizado com sucesso!");
    setMessageType("success");
    
  } catch (err) {
    console.error(err);
    setMessage("❌ Erro ao atualizar perfil");
    setMessageType("error");
  }
};

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      navigate("/login");
    }
  };

  const handleUpload = async () => {
    if (!newImage || !user) return;
    setUploading(true);
    setMessage("");
    try {
      let fileToUpload = newImage;
      if (croppedAreaPixels) {
        fileToUpload = await getCroppedImg(previewUrl, croppedAreaPixels);
      }

      const thumb = await generateCroppedImage(fileToUpload);

      const fileExt = thumb.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, thumb, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      if (urlError) throw urlError;

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const session = (await supabase.auth.getSession())?.data?.session;
      if (!session) throw new Error("Usuário não está logado");
      const token = session.access_token;

      const res = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePic: publicUrl }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      setUser((prev) => ({ ...prev, avatar_url: publicUrl }));
      setShowModal(false);
      setNewImage(null);
      setMessage("✅ Foto de perfil atualizada!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(`❌ Erro ao enviar imagem: ${err.message}`);
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) setNewImage(file);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Tem certeza que deseja remover este item?")) return;
    try {
      const session = (await supabase.auth.getSession())?.data?.session;
      if (!session) throw new Error("Usuário não autenticado");
      const token = session.access_token;
      const res = await fetch(`${API_URL}/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao remover item");
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setMessage("✅ Item removido com sucesso!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao remover item: " + (err.message || err));
      setMessageType("error");
    }
  };

  if (loading) return <LogoLoader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden py-12 px-6 transition-colors duration-300">
      {/* Fundo Animado Melhorado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Partículas flutuantes */}
        {[...Array(25)].map((_, i) => (
          <FloatingParticle key={`particle-${i}`} index={i} />
        ))}

        {/* Bolhas flutuantes */}
        {[...Array(12)].map((_, i) => (
          <FloatingBubble key={`bubble-${i}`} index={i} />
        ))}

        {/* Raios de luz */}
        {[...Array(8)].map((_, i) => (
          <LightBeam key={`light-${i}`} index={i} />
        ))}

        {/* Efeito de brilho central */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Tema */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-110"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>

      {/* Botão voltar */}
      <div className="flex items-center mb-6 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="group p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Mensagem */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-4xl mx-auto mb-6 p-4 rounded-xl font-medium text-center text-white shadow-2xl backdrop-blur-sm ${messageType === "success"
            ? "bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400"
            : "bg-gradient-to-r from-red-500 to-rose-600 border border-red-400"
            }`}
        >
          {message}
        </motion.div>
      )}

      {/* Perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 relative z-10 border border-white/20 dark:border-gray-700/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.15)] transition-all duration-500"
      >
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative w-32 h-32 group">
            {!user.avatar_url ? (
              <div className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-2xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:opacity-0 transition-all duration-500 relative">
                <User className="w-16 h-16 text-gray-400" />
                {uploading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black/30 rounded-full backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-32 h-32">
                <img
                  src={user.avatar_url}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-2xl"
                />
                {uploading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black/30 rounded-full backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/60 to-blue-600/60 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-full cursor-pointer transition-all duration-500 backdrop-blur-sm"
              onClick={() => setShowModal(true)}
            >
              <span className="text-white font-semibold text-center text-sm">
                + Alterar Foto
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent tracking-wide">
            Meu Perfil
          </h1>
          {!editing ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Nome:</strong> {user.name || "Não informado"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-mail:</strong> {user.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Matrícula:</strong> {user.matricula || "Não informado"}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </button>
                <button
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={handleLogout}
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
                className="w-full px-4 py-2 border-2 rounded-xl border-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:outline-none dark:bg-gray-700 dark:text-gray-100 transition-all"
              />
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-2 border-2 rounded-xl bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-300 border-gray-300"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg hover:scale-105"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all shadow-lg hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal upload (mantido igual) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl relative shadow-2xl border border-white/20 dark:border-gray-700/50">
            <button
              onClick={() => {
                setShowModal(false);
                setNewImage(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Alterar Foto de Perfil
            </h2>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!previewUrl) {
                  document.getElementById("fileInput")?.click();
                }
              }}
              className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 transition-all duration-300 ${previewUrl
                ? "cursor-default opacity-100 border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20"
                : "cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/10"
                } ${isDragging
                  ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20"
                  : "border-gray-300 dark:border-gray-600"
                }`}
            >
              {previewUrl ? (
                <div className="w-full h-64 relative">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedPixels) =>
                      setCroppedAreaPixels(croppedPixels)
                    }
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute bottom-2 right-2 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-400 hover:to-rose-500 transition-all shadow-lg"
                  >
                    Remover imagem
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <User className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Arraste uma imagem aqui ou{" "}
                    <span className="underline text-cyan-500">clique</span>
                  </p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith("image/")) setNewImage(file);
                }}
                className="hidden"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !newImage}
              className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
            >
              {uploading ? "Enviando..." : "Salvar Foto"}
            </button>
          </div>
        </div>
      )}

      {/* Meus itens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mt-12 relative z-10"
      >
        
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meus Itens
          </h2>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="border rounded-2xl shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 p-4 flex flex-col border-cyan-200 dark:border-gray-700"
              >
                <img
                  src={item.images?.[0]?.url || livroImg}
                  alt={item.title}
                  className="w-full h-36 object-contain mb-3 cursor-pointer rounded-lg hover:scale-105 transition-transform"
                  onClick={() => navigate(`/itempage/${item.id}`)}
                />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-xl ${item.status === "Perdido"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-2xl"
                    }`}
                >
                  {item.status}
                </span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm rounded-lg hover:from-red-400 hover:to-rose-500 transition-all shadow-lg hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" /> Remover
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
            Você ainda não cadastrou nenhum item.
          </p>
        )}
      </motion.div>
    </div>
  );
}
