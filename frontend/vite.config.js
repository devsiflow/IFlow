import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // permite acessar de outros dispositivos
    port: 5173,      // porta do seu servidor
    strictPort: false, // se já estiver em uso, muda automaticamente
  },
});
