import React from "react";
import IflowLogo from "../assets/iflowsvg.svg"; // caminho da sua logo

export default function LogoLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Logo do IFlow com pulsação e brilho verde */}
      <img
        src={IflowLogo}
        alt="IFlow Logo"
        className="w-40 h-40 md:w-56 md:h-56 animate-pulse-green"
      />

      <style>
        {`
          @keyframes pulse-green {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px #22c55e); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 20px #22c55e); }
          }
          .animate-pulse-green {
            animation: pulse-green 1.2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
