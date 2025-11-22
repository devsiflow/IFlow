import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Building } from "lucide-react";

export default function ManageCampus() {
  const [campus, setCampus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarCampus();
  }, []);

  const carregarCampus = async () => {
    try {
      const res = await fetch(`${API_URL}/campus`);
      if (!res.ok) throw new Error("Erro ao carregar campus");

      const data = await res.json();
      setCampus(data);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar campus");
    } finally {
      setLoading(false);
    }
  };

  const salvarCampus = async (e) => {
    e.preventDefault();
    
    if (!form.nome.trim()) {
      alert("Nome do campus é obrigatório");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editando 
        ? `${API_URL}/campus/${editando.id}`
        : `${API_URL}/campus`;
      
      const method = editando ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar campus");

      setShowModal(false);
      setForm({ nome: "" });
      setEditando(null);
      carregarCampus();
      
      alert(`Campus ${editando ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar campus");
    }
  };

  const excluirCampus = async (campusId) => {
    if (!window.confirm("Tem certeza que deseja excluir este campus? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/campus/${campusId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir campus");

      carregarCampus();
      alert("Campus excluído com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir campus");
    }
  };

  const editarCampus = (campus) => {
    setEditando(campus);
    setForm({ nome: campus.nome });
    setShowModal(true);
  };

  const novoCampus = () => {
    setEditando(null);
    setForm({ nome: "" });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Gerenciar Campus
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Adicione, edite ou remova campus do sistema
          </p>
        </div>
        <button
          onClick={novoCampus}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Campus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campus.map((camp) => (
          <div
            key={camp.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {camp.nome}
              </h4>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              ID: {camp.id}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editarCampus(camp)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => excluirCampus(camp.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para adicionar/editar campus */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              {editando ? "Editar Campus" : "Novo Campus"}
            </h3>
            
            <form onSubmit={salvarCampus}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Campus
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o nome do campus"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditando(null);
                    setForm({ nome: "" });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {editando ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}