import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth"; // importa o hook

function CadastrarItem() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth(); // pega usuário e token do hook

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
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (loading) {
      alert("Carregando sessão, aguarde...");
      return;
    }

    if (!token) {
      alert("Usuário não está logado ou sessão expirou!");
      return;
    }

    try {
      let imageUrl = null;

      // Upload da imagem no Supabase Storage
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

      // Envia dados do item para o backend com token atualizado
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

      navigate("/marketplace");
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao cadastrar item: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MenuOtherPages />
      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-sm rounded-2xl p-10 space-y-6">
          <h2 className="text-3xl font-semibold text-neutral-900">📋 Cadastrar Item</h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-neutral-800">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Mochila, Celular..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Ex: Preta, com adesivo da Marvel..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>

            {/* Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <input
                name="local"
                type="text"
                value={form.local}
                onChange={handleChange}
                required
                placeholder="Ex: Sala 101, Corredor perto do banheiro..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
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
              className={`w-full border-2 border-dashed ${
                isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
              } rounded-md p-6 flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer transition`}
            >
              <label className="cursor-pointer text-center w-full">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-md object-contain mb-3" />
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
              className="w-full py-3 bg-[#084808] hover:bg-[#066c06] text-white font-medium text-sm rounded-md transition-colors"
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
