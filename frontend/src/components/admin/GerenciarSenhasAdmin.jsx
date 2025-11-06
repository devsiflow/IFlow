import { useState } from "react";

export default function GerenciarSenhasAdmin() {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const token = localStorage.getItem("token");

  const enviarEmailReset = async () => {
    const res = await fetch(`/api/admin/usuarios/dummy/reset-password`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ method: "email", email }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  const resetDireto = async () => {
    const res = await fetch(`/api/admin/usuarios/${uid}/reset-password`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ method: "direct", uid, newPassword: novaSenha }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gerenciar Senhas</h2>

      <div>
        <h3 className="font-medium">Enviar email de redefinição</h3>
        <input
          placeholder="Email do usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-80 mr-2"
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={enviarEmailReset}>
          Enviar
        </button>
      </div>

      <div>
        <h3 className="font-medium">Redefinir diretamente (superadmin)</h3>
        <input
          placeholder="UID do usuário"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="border p-2 rounded w-80 mr-2"
        />
        <input
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="border p-2 rounded w-80 mr-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={resetDireto}>
          Atualizar
        </button>
      </div>
    </div>
  );
}
