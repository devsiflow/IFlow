// src/components/Loader.jsx
import React from "react";

export default function GeralLoader({ message = "Carregando..." }) {
  return (
    <>
      <style>{`
        @keyframes spinInsano {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>

      <div className="w-full flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-40"></div>

          <div
            className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-transparent border-purple-500"
            style={{ animation: "spinInsano 0.8s linear infinite" }}
            aria-hidden
          />
        </div>

        <p className="mt-6 text-lg font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    </>
  );
}
