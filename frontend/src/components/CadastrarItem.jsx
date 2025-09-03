import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuOtherPages from "../components/MenuOtherPages";
import { useItens } from "../hooks/useItens";

function CadastrarItem() {
  const navigate = useNavigate();
  const { adicionarItem } = useItens();

  const [form, setForm] = useState({
    name: "",
    description: "",
    local: "",
    status: "Perdido",
    date: "",
    image: "",
    category: "",
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const processImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!form.name || !form.description || !form.local || !form.category) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          location: form.local,
          status: form.status,
          date: form.date,
          image: form.image,
          categoryName: form.category,
          userId: 1, // substitua pelo ID do usuário logado
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao cadastrar item");
      }

      const data = await res.json();
      adicionarItem(data);
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Ex: Eletrônico, Roupa..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data (opcional)</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>

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
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-md object-contain mb-3"
                  />
                ) : (
                  <span>
                    Arraste uma imagem aqui ou{" "}
                    <span className="underline text-indigo-600">clique para selecionar</span>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              >
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
              </select>
            </div>

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
