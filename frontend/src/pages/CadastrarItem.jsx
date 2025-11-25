import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { ArchiveRestore } from "lucide-react";

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
  const { token, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    local: "",
    category: "",
    tipo: "", // 🔥 encontrou / perdeu
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles(validFiles);

    const previews = validFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).slice(0, 5);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles(validFiles);

    const previews = validFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tipo) {
      alert("Escolha se você PERDEU ou ENCONTROU o item.");
      return;
    }

    if (!form.name || !form.description || !form.local || !form.category) {
      alert("Preencha todos os campos!");
      return;
    }

    if (loading) {
      alert("Carregando sessão...");
      return;
    }

    if (!token) {
      alert("Usuário não está logado!");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";

      // Obtém dados do usuário
      const userData = await supabase.auth.getUser(token);
      const user = userData.data.user;

      // Sincroniza perfil
      await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.user_metadata?.name || "Usuário",
          matricula:
            user.user_metadata?.matricula || `user_${user.id.slice(0, 8)}`,
          profilePic: user.user_metadata?.avatar_url || null,
        }),
      });

      // Upload imagens
      const uploadedUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const thumb = await generateThumbnail(file);
        const ext = thumb.name.split(".").pop();
        const fileName = `${Date.now()}_${i}.${ext}`;
        const filePath = `public/${fileName}`;

        await supabase.storage.from("iflow-item").upload(filePath, thumb, {
          upsert: true,
        });

        const { data } = supabase.storage
          .from("iflow-item")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      // 🔥 status conforme escolha do usuário
      const statusFinal =
        form.tipo === "encontrei" ? "encontrado" : "nao_encontrado";

      // Criar item
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          imageUrls: uploadedUrls,
          status: statusFinal,
          location: form.local,
          categoryName: form.category,
        }),
      });

      const responseText = await res.text();
      const responseData = JSON.parse(responseText);

      if (!res.ok) {
        throw new Error(responseData.error);
      }

      alert("Item cadastrado com sucesso!");

      // Redireciona conforme tipo
      navigate(
        form.tipo === "encontrei" ? "/catalogo" : "/itens-nao-encontrados"
      );
    } catch (err) {
      console.error("Erro:", err);
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
          <h2 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-center gradient-text mb-6">
            <ArchiveRestore className="w-10 h-10 text-green-700 dark:text-green-400" />
            Cadastrar Item
          </h2>

          {/* 🔥 escolha ENCONTREI / PERDI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, tipo: "encontrei" })}
              className={`p-4 rounded-xl border-2 transition-all font-medium ${
                form.tipo === "encontrei"
                  ? "border-green-600 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              }`}
            >
              🟢 Encontrei este item
              <p className="text-xs opacity-70 mt-1">Vai para o catálogo</p>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, tipo: "perdi" })}
              className={`p-4 rounded-xl border-2 transition-all font-medium ${
                form.tipo === "perdi"
                  ? "border-blue-600 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              }`}
            >
              🔵 Perdi este item
              <p className="text-xs opacity-70 mt-1">
                Vai para Itens Não Encontrados
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Nome do Item</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Mochila, Celular..."
                className="px-5 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="px-5 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Local</label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                required
                className="px-5 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Categoria */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="px-5 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
              >
                <option value="">Selecione</option>
                <option value="Eletrônico">Eletrônico</option>
                <option value="Roupa">Roupa</option>
                <option value="Acessório">Acessório</option>
                <option value="Material Escolar">Material Escolar</option>
                <option value="Documentos">Documentos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Upload imagens */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Imagens (até 5)</label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
                  isDragging
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                }`}
              >
                <label className="cursor-pointer w-full text-center">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative">
                            <img
                              src={src}
                              alt="preview"
                              className="h-28 w-28 rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm">Clique para alterar</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">📷</div>
                      <p>
                        Arraste imagens aqui ou{" "}
                        <span className="underline text-green-700">
                          clique para selecionar
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG, JPEG (máx. 5)
                      </p>
                    </div>
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-green-800/70 cursor-not-allowed"
                  : "bg-green-800 hover:bg-green-700"
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <ArchiveRestore className="w-6 h-6" />
                  Cadastrar Item
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
