import { useNavigate } from "react-router-dom";

function ValidacaoConfirmada() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-4">✅ Validação enviada!</h1>
        <p className="text-neutral-700 mb-6">
          Suas respostas foram enviadas para verificação. Entraremos em contato em breve.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}

export default ValidacaoConfirmada;
