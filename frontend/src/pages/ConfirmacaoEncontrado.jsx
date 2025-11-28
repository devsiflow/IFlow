import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";
import { supabase } from "../lib/supabaseClient";

export default function ConfirmacaoEncontrado() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // 🔥 estado da foto

    const API_URL =
        import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";

    // 🔥 BUSCA O ITEM COMPLETO
    useEffect(() => {
        async function loadItem() {
            try {
                const res = await fetch(`${API_URL}/items/${id}`);
                const data = await res.json();
                console.log("ITEM CARREGADO:", data);
                setItem(data);
            } catch (err) {
                console.error("Erro ao carregar item:", err);
            }
            setLoading(false);
        }

        loadItem();
    }, [id]);

    // 🔥 GARANTE QUE A IMAGEM APARECE SEMPRE
    const getImage = () => {
        if (!item) return livroImg;

        if (Array.isArray(item.images) && item.images.length > 0) {
            return item.images[0].url;
        }

        if (item.imageUrl) return item.imageUrl;

        return livroImg;
    };

    // 🔥 NOVA FUNÇÃO DE CONFIRMAÇÃO COM ENVIO DE FOTO
    const confirmar = async () => {
        if (!selectedImage) {
            alert("Você precisa tirar/enviar uma foto para confirmar!");
            return;
        }

        setConfirming(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Você precisa estar logado!");
                return;
            }

            const token = session.access_token;

            const formData = new FormData();
            formData.append("status", "found");
            formData.append("image", selectedImage); // 📸 foto enviada
            formData.append("itemId", id);

            const res = await fetch(`${API_URL}/items/${id}/confirmar-encontrado`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                console.error(result);
                throw new Error(result.error || "Erro ao enviar foto");
            }

            navigate(`/itempage/${id}?confirmado=true`);
        } catch (err) {
            console.error("Erro:", err);
            alert("Erro ao confirmar item!");
        }

        setConfirming(false);
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-lg font-semibold">
                Carregando item...
            </div>
        );
    }

    if (!item) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-red-600 font-semibold">
                Item não encontrado.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-5 flex flex-col items-center">

            <div className="w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl shadow-xl p-6 mt-10 border border-neutral-300 dark:border-neutral-700">

                {/* TÍTULO */}
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-4">
                    Você encontrou este item?
                </h1>

                <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                    Confirme para registrarmos que alguém encontrou este item perdido.
                </p>

                {/* FOTO ORIGINAL */}
                <div className="w-full h-60 rounded-lg overflow-hidden mb-5 shadow-md">
                    <img
                        src={getImage()}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INPUT DE FOTO NOVA */}
                <div className="mb-6">
                    <label className="block mb-2 text-neutral-800 dark:text-neutral-200 font-medium">
                        Tire ou envie uma foto para confirmar:
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        className="w-full p-2 rounded-lg border bg-neutral-200 dark:bg-neutral-700"
                    />

                    {selectedImage && (
                        <div className="mt-4">
                            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2">
                                Prévia da foto enviada:
                            </p>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                className="w-full h-40 object-cover rounded-lg shadow"
                            />
                        </div>
                    )}
                </div>

                {/* INFORMAÇÕES DO ITEM */}
                <div className="space-y-2 mb-6">
                    <p className="text-neutral-800 dark:text-neutral-200">
                        <strong>Item:</strong> {item.title}
                    </p>

                    <p className="text-neutral-800 dark:text-neutral-200">
                        <strong>Local encontrado:</strong> {item.location}
                    </p>

                    <p className="text-neutral-800 dark:text-neutral-200">
                        <strong>Cadastrado em:</strong>{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* BOTÃO DE CONFIRMAÇÃO */}
                <button
                    disabled={confirming}
                    onClick={confirmar}
                    className={`
                        w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md 
                        transition-all duration-300 relative overflow-hidden
                        ${confirming ? "bg-red-400" : "bg-red-600 hover:bg-red-700 active:scale-[0.97]"}
                    `}
                >
                    {confirming ? (
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                                style={{ animation: "spinInsano 0.7s linear infinite" }}
                            ></div>
                            <span className="opacity-90">Confirmando...</span>
                        </div>
                    ) : (
                        "Confirmar que encontrei"
                    )}
                </button>

                {/* CANCELAR */}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 w-full py-2 text-neutral-700 dark:text-neutral-300 hover:underline text-sm"
                >
                    Cancelar
                </button>
            </div>

        </div>
    );
}
