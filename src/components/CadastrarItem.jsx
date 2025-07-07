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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...form,
      date: form.date || new Date().toLocaleDateString(),
    };
    adicionarItem(newItem);
    navigate("/marketplace");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MenuOtherPages />
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-md rounded-2xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Cadastre um Item Perdido ou Achado
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Item
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Mochila, Celular..."
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Ex: Preta, com adesivo da Marvel..."
                rows={3}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            {/* Local (texto livre) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Local onde foi perdido/encontrado
              </label>
              <input
                name="local"
                type="text"
                value={form.local}
                onChange={handleChange}
                required
                placeholder="Ex: Sala 101, Corredor perto do banheiro..."
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data (opcional)
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Foto do Item
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full file:py-2 file:px-4 file:rounded-md file:bg-green-500 file:text-white hover:file:bg-green-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
              </select>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition"
            >
              Cadastrar Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarItem;
