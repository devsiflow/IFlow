import React from "react";
import IflowLogo from "../assets/iflowtextsvg.svg";
import iflowBackground from "../assets/iflowBackgroundWhite.jpg";

export default function LogoLoader() {
  return (
    <div
      className="flex items-center justify-center h-screen relative overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${iflowBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
      }}
    >
      {/* Glow suave ao fundo */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[140px] animate-glow-pulse" />

      {/* Reflexos leves orbitando */}
      <div className="absolute w-[300px] h-[300px] border border-emerald-400/10 rounded-full animate-orbit-glow" />
      <div className="absolute w-[500px] h-[500px] border border-emerald-400/5 rounded-full animate-orbit-glow-slow" />

      {/* Faixa de brilho cortando */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-scanline"></div>
      </div>

      {/* Logo */}
      <img
        src={IflowLogo}
        alt="IFlow Logo"
        className="relative z-10 w-36 h-36 md:w-52 md:h-52 animate-logo-glow"
      />

      <style>{`
        /* Logo brilho dinâmico */
        @keyframes logo-glow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px #22c55e) drop-shadow(0 0 25px #22c55e);
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 18px #4ade80) drop-shadow(0 0 40px #86efac);
          }
        }
        .animate-logo-glow {
          animation: logo-glow 3.2s ease-in-out infinite;
        }

        /* Glow pulsante do fundo */
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 6s ease-in-out infinite;
        }

        /* Linhas orbitais */
        @keyframes orbit-glow {
          0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.05); opacity: 0.6; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
        }
        .animate-orbit-glow {
          animation: orbit-glow 8s linear infinite;
        }
        .animate-orbit-glow-slow {
          animation: orbit-glow 16s linear infinite;
        }

        /* Linha de scan luminosa */
        @keyframes scanline {
          0% { transform: translateY(-100%) scaleY(0.5); opacity: 0; }
          50% { transform: translateY(0%) scaleY(1); opacity: 0.8; }
          100% { transform: translateY(100%) scaleY(0.5); opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
