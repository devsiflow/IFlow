import React from "react";
import IflowLogo from "../assets/iflowsvg.svg";
import iflowBackground from "../assets/iflowBackground.jpg";

export default function LogoLoader() {
  return (
    <div
      className="flex items-center justify-center h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${iflowBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay radial preto atrás da logo */}
      <div
        className="absolute z-0"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Efeito de glow no fundo */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/30 rounded-full blur-3xl animate-pulse" />

      {/* Meteors */}
      <div className="meteor meteor-1" />
      <div className="meteor meteor-2" />
      <div className="meteor meteor-3" />
      <div className="meteor meteor-4" />

      {/* Logo */}
      <img
        src={IflowLogo}
        alt="IFlow Logo"
        className="relative z-10 w-40 h-40 md:w-56 md:h-56 animate-logo-futuristic"
      />

      <style>
        {`
          /* Logo futurista */
          @keyframes logo-futuristic {
            0% { transform: perspective(800px) rotateY(0deg) scale(1); filter: drop-shadow(0 0 8px #22c55e) drop-shadow(0 0 20px #22c55e);}
            25% { transform: perspective(800px) rotateY(10deg) scale(1.05); filter: drop-shadow(0 0 12px #4ade80) drop-shadow(0 0 30px #22c55e);}
            50% { transform: perspective(800px) rotateY(0deg) scale(1.1); filter: drop-shadow(0 0 16px #22c55e) drop-shadow(0 0 40px #86efac);}
            75% { transform: perspective(800px) rotateY(-10deg) scale(1.05); filter: drop-shadow(0 0 12px #4ade80) drop-shadow(0 0 30px #22c55e);}
            100% { transform: perspective(800px) rotateY(0deg) scale(1); filter: drop-shadow(0 0 8px #22c55e) drop-shadow(0 0 20px #22c55e);}
          }
          .animate-logo-futuristic { animation: logo-futuristic 3s ease-in-out infinite; }

          /* Meteors */
          .meteor { position: absolute; width: 120px; height: 2px; background: linear-gradient(90deg, #22c55e, transparent); border-radius: 9999px; opacity: 0.8; filter: drop-shadow(0 0 6px #22c55e);}
          @keyframes meteor-move { 0% { transform: translateX(-150%) translateY(-150%) rotate(45deg); opacity:1;} 100% { transform: translateX(150vw) translateY(150vh) rotate(45deg); opacity:0;} }
          .meteor-1 { top:10%; left:-20%; animation: meteor-move 1.5s linear infinite; animation-delay:0s;}
          .meteor-2 { top:40%; left:-30%; animation: meteor-move 1.8s linear infinite; animation-delay:0.5s;}
          .meteor-3 { top:70%; left:-25%; animation: meteor-move 2s linear infinite; animation-delay:1s;}
          .meteor-4 { top:20%; left:-15%; animation: meteor-move 1.6s linear infinite; animation-delay:1.5s;}
        `}
      </style>
    </div>
  );
}
