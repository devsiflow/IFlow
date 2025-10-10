import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

// Função para gerar miniatura antes de subir
async function generateThumbnail(file, maxSize = 400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.8
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function CadastrarItem() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    local: "",
    category: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // máximo 5 imagens
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles(validFiles);
    setImagePreviews(validFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).slice(0, 5);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles(validFiles);
    setImagePreviews(validFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.local || !form.category) {
      alert("Preencha todos os campos!");
      return;
    }
    if (loading) return alert("Carregando sessão...");
    if (!token) return alert("Usuário não está logado!");
    setIsSubmitting(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const thumb = await generateThumbnail(file);

        const ext = thumb.name.split(".").pop();
        const fileName = `${Date.now()}_${i}.${ext}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("iflow-item")
          .upload(filePath, thumb, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("iflow-item").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          location: form.local,
          categoryName: form.category,
          images: uploadedUrls, // envia todas as URLs
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao cadastrar item");
      }

      navigate("/catalogo");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <MenuOtherPages />
      <div className="flex justify-center items-start px-4 pt-32 pb-16">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-md border border-gray-200 dark:border-gray-700 p-10 space-y-8">
          <h2 className="text-4xl font-extrabold text-center gradient-text mb-6">
            🚀 Cadastrar Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Nome do Item
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Mochila, Celular..."
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-inner"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Descrição
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Ex: Preta, com adesivo da Marvel..."
                rows={4}
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-inner resize-none"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Local
              </label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                required
                placeholder="Ex: Sala 101, Corredor perto do banheiro..."
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-inner"
              />
            </div>

            {/* Categoria */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Categoria
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-inner"
              >
                <option value="">Selecione</option>
                <option value="Eletrônico">Eletrônico</option>
                <option value="Roupa">Roupa</option>
                <option value="Acessório">Acessório</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Upload de imagens */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition shadow-inner ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                  : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
              } text-gray-500 dark:text-gray-300`}
            >
              <label className="cursor-pointer w-full text-center">
                {imagePreviews.length ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {imagePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="h-28 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <span>
                    Arraste até 5 imagens aqui ou{" "}
                    <span className="underline text-indigo-600 dark:text-indigo-400">
                      clique para selecionar
                    </span>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                />
              </label>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 dark:from-indigo-800 dark:to-indigo-600 dark:hover:from-indigo-900 dark:hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform ${
                isSubmitting ? "opacity-70" : "hover:scale-105"
              }`}
            >
              {isSubmitting ? "⏳ Enviando..." : "✅ Cadastrar Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
