import { useEffect, useState } from "react";
import { Shield, ShieldOff, Crown, User } from "lucide-react";

export default function ManageAdmins() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao carregar usuários");

      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId, isCurrentlyAdmin) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !isCurrentlyAdmin }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar usuário");

      // Atualizar lista local
      setUsuarios(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, isAdmin: !isCurrentlyAdmin } : user
        )
      );

      alert(`Usuário ${!isCurrentlyAdmin ? 'tornado admin' : 'removido como admin'} com sucesso!`);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar usuário");
    }
  };

  const toggleSuperAdmin = async (userId, isCurrentlySuperAdmin) => {
    if (!window.confirm("⚠️ ATENÇÃO: Alterar status de SuperAdmin? Esta ação é crítica!")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/superadmin/users/${userId}/toggle-superadmin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao atualizar SuperAdmin");

      setUsuarios(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, isSuperAdmin: !isCurrentlySuperAdmin } : user
        )
      );

      alert("Status de SuperAdmin atualizado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar SuperAdmin");
    }
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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Gerenciar Administradores
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie permissões de administrador e superadministrador dos usuários
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {usuario.profilePic ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={usuario.profilePic}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {usuario.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {usuario.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {usuario.matricula}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {usuario.isSuperAdmin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        <Crown className="w-3 h-3 mr-1" />
                        SuperAdmin
                      </span>
                    ) : usuario.isAdmin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        <User className="w-3 h-3 mr-1" />
                        Usuário
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdmin(usuario.id, usuario.isAdmin)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                        usuario.isAdmin
                          ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200"
                          : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200"
                      }`}
                    >
                      {usuario.isAdmin ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-1" />
                          Remover Admin
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          Tornar Admin
                        </>
                      )}
                    </button>

                    {!usuario.isSuperAdmin && (
                      <button
                        onClick={() => toggleSuperAdmin(usuario.id, usuario.isSuperAdmin)}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-200"
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        SuperAdmin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}