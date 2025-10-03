import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

function CadastrarItem() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    local: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.local || !form.category) {
      alert("Preencha todos os campos!");
      return;
    }
    if (loading) return alert("Carregando sessão...");
    if (!token) return alert("Usuário não está logado!");

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("iflow-item")
          .upload(`public/${fileName}`, imageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("iflow-item")
          .getPublicUrl(`public/${fileName}`);
        imageUrl = data.publicUrl;
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
          image: imageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao cadastrar item");
      }

      navigate("/bancoitens");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900 font-sans">
      <MenuOtherPages />

      <div className="flex justify-center items-start px-4 pt-32 pb-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-gray-200 p-10 space-y-8 backdrop-blur-md">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide gradient-text mb-6 text-center">
            🚀 Cadastrar Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Nome do Item</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Mochila, Celular..."
                className="px-5 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition text-gray-900 bg-gray-50 shadow-inner"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Ex: Preta, com adesivo da Marvel..."
                rows={4}
                className="px-5 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition text-gray-900 bg-gray-50 shadow-inner resize-none"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Local</label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                required
                placeholder="Ex: Sala 101, Corredor perto do banheiro..."
                className="px-5 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition text-gray-900 bg-gray-50 shadow-inner"
              />
            </div>

            {/* Categoria */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="px-5 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition text-gray-900 bg-gray-50 shadow-inner"
              >
                <option value="">Selecione</option>
                <option value={1}>Eletrônico</option>
                <option value={2}>Roupa</option>
                <option value={3}>Acessório</option>
                <option value={4}>Outros</option>
              </select>
            </div>

            {/* Drag & Drop */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer transition ${
                isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50"
              } shadow-inner`}
            >
              <label className="cursor-pointer w-full text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-44 mx-auto rounded-xl object-contain mb-3 shadow-md"
                  />
                ) : (
                  <span>
                    Arraste uma imagem aqui ou{" "}
                    <span className="underline text-indigo-600">clique para selecionar</span>
                  </span>
                )}
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-transform transform hover:scale-105"
            >
              ✅ Cadastrar Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarItem;
