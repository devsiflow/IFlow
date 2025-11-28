import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Building, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ManageCampus() {
  const [campus, setCampus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({ nome: "" });
  const [campusSelecionado, setCampusSelecionado] = useState(null);

  const [toast, setToast] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      console.error(error);
      showToast("Erro ao carregar campus", "error");
    } finally {
      setLoading(false);
    }
  };

  const salvarCampus = async (e) => {
    e.preventDefault();

    if (!form.nome.trim()) {
      showToast("O nome do campus é obrigatório", "error");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        return;
      }

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

      showToast(`Campus ${editando ? "atualizado" : "criado"} com sucesso!`);
    } catch (error) {
      console.error(error);
      showToast("Erro ao salvar campus", "error");
    }
  };

  const abrirModalExcluir = (camp) => {
    setCampusSelecionado(camp);
    setShowDeleteModal(true);
  };

  const excluirCampus = async () => {
    if (!campusSelecionado) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        return;
      }

      const res = await fetch(`${API_URL}/campus/${campusSelecionado.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(result.error || "Erro ao excluir campus", "error");
        return;
      }

      carregarCampus();
      showToast("Campus excluído com sucesso!");

      setShowDeleteModal(false);
      setCampusSelecionado(null);
    } catch (error) {
      console.error(error);
      showToast("Erro ao excluir campus", "error");
    }
  };

  const editarCampus = (camp) => {
    setEditando(camp);
    setForm({ nome: camp.nome });
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
    <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-50 animate-fade-in
          ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Campus</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Adicione, edite ou remova campus do sistema.
          </p>
        </div>

        <button
          onClick={novoCampus}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Novo Campus
        </button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campus.map((camp) => (
          <div
            key={camp.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{camp.nome}</h4>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              ID: {camp.id}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editarCampus(camp)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>

              <button
                onClick={() => abrirModalExcluir(camp)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md shadow-xl animate-scale-in">

            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {editando ? "Editar Campus" : "Novo Campus"}
              </h3>

              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <form onSubmit={salvarCampus}>
              <label className="text-sm text-gray-600 dark:text-gray-300">Nome do Campus</label>

              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ nome: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                placeholder="Digite o nome"
              />

              <button
                type="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md shadow"
              >
                {editando ? "Salvar Alterações" : "Criar Campus"}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {showDeleteModal && campusSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-sm shadow-xl animate-scale-in">

            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Excluir Campus
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tem certeza que deseja excluir o campus{" "}
              <strong>{campusSelecionado.nome}</strong>?  
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={excluirCampus}
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
