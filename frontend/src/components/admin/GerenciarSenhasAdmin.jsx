import { useState, useEffect } from "react";

export default function GerenciarSenhasAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    fetch("/api/admin/usuarios").then((r) => r.json()).then(setUsuarios);
  }, []);

  async function redefinirSenha(id) {
    await fetch(`/api/admin/usuarios/${id}/reset-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ novaSenha }),
    });
    alert("Senha redefinida com sucesso!");
    setNovaSenha("");
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Redefinir Senhas</h2>
      {usuarios.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between border-b py-2 border-gray-200 dark:border-gray-700"
        >
          <span>{u.nome} ({u.email})</span>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="border rounded p-1 text-sm"
            />
            <button
              onClick={() => redefinirSenha(u.id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Redefinir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}