import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      aria-pressed={isDark}
      className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
      title={isDark ? "Ir para claro" : "Ir para escuro"}
    >
      {isDark ? <span aria-hidden>🌙</span> : <span aria-hidden>☀️</span>}
    </button>
  );
}
