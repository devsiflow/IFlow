import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import livroImg from "../assets/livro.jpg";
import { supabase } from "../lib/supabaseClient";

export default function ConfirmacaoEncontrado() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [toast, setToast] = useState(null);

    const fileInputRef = useRef(null);

    const API_URL =
        import.meta.env.VITE_API_URL || "https://iflow-zdbx.onrender.com";

    // 🔥 TOAST LINDO (INSTAGRAM STYLE)
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // 🔥 BUSCAR ITEM
    useEffect(() => {
        async function loadItem() {
            try {
                const res = await fetch(`${API_URL}/items/${id}`);
                const data = await res.json();
                setItem(data);
            } catch (err) {
                showToast("error", "Erro ao carregar item.");
            }
            setLoading(false);
        }

        loadItem();
    }, [id]);

    const getImage = () => {
        if (!item) return livroImg;

        if (Array.isArray(item.images) && item.images.length > 0) {
            return item.images[0].url;
        }

        if (item.imageUrl) return item.imageUrl;

        return livroImg;
    };

    // 🔥 DRAG & DROP
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    // 🔥 INPUT NORMAL
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    // 🔥 FUNÇÃO DE CONFIRMAÇÃO FINAL
    const confirmar = async () => {
        if (!selectedImage) {
            showToast("warning", "Envie uma foto para confirmar!");
            return;
        }

        setConfirming(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                showToast("warning", "Você precisa estar logado!");
                setConfirming(false);
                return;
            }

            const token = session.access_token;

            const formData = new FormData();
            formData.append("image", selectedImage);

            const res = await fetch(`${API_URL}/items/${id}/confirmar-encontrado`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                showToast("error", result.error || "Erro ao confirmar.");
                setConfirming(false);
                return;
            }

            showToast("success", "Item confirmado com sucesso!");

            setTimeout(() => navigate(`/itempage/${id}?confirmado=true`), 1200);

        } catch (err) {
            showToast("error", "Erro inesperado ao confirmar.");
        }

        setConfirming(false);
    };

    // 🔥 LOADING
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-lg font-semibold">
                Carregando...
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

            {/* TOAST STYLE */}
            {toast && (
                <div
                    className={`
                    fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-xl 
                    backdrop-blur-md animate-fade
                    ${toast.type === "success" && "bg-green-600"}
                    ${toast.type === "error" && "bg-red-600"}
                    ${toast.type === "warning" && "bg-yellow-600"}
                `}
                >
                    {toast.message}
                </div>
            )}

            <style>
                {`
                @keyframes fade {
                    from { opacity: 0; transform: translate(-50%, -10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade {
                    animation: fade 0.3s ease-out;
                }

                @keyframes spinInsano {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>

            <div className="w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl shadow-xl p-6 mt-10 border border-neutral-300 dark:border-neutral-700">

                <h1 className="text-2xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-4">
                    Confirmar item encontrado
                </h1>

                <div className="w-full rounded-xl overflow-hidden h-52 shadow mb-5">
                    <img
                        src={getImage()}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 🔥 ÁREA DRAG & DROP + CAMERA */}
                <div
                    className={`
                        w-full p-6 rounded-xl border-2 border-dashed cursor-pointer 
                        transition-all bg-neutral-200 dark:bg-neutral-700
                        ${isDragging ? "border-red-500 bg-red-100 dark:bg-red-900" : "border-neutral-400"}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    {!previewImage ? (
                        <div className="text-center text-neutral-700 dark:text-neutral-200">
                            <p className="font-medium mb-1">Arraste uma foto aqui</p>
                            <p className="text-sm opacity-70">ou toque para abrir a câmera / galeria</p>
                        </div>
                    ) : (
                        <img
                            src={previewImage}
                            className="w-full h-52 object-cover rounded-lg shadow"
                        />
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* INFO */}
                <p className="text-neutral-700 dark:text-neutral-300 text-center mt-6 text-sm">
                    Envie uma foto REAL para confirmar que encontrou o item.
                </p>

                {/* BOTÃO CONFIRMAR */}
                <button
                    onClick={confirmar}
                    disabled={confirming}
                    className={`
                        w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md mt-6
                        ${confirming ? "bg-red-400" : "bg-red-600 hover:bg-red-700 active:scale-95"}
                    `}
                >
                    {confirming ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full" style={{ animation: "spinInsano .6s linear infinite" }}></div>
                            Confirmando...
                        </div>
                    ) : (
                        "Confirmar"
                    )}
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 w-full py-2 text-neutral-600 dark:text-neutral-300 text-sm text-center hover:underline"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
