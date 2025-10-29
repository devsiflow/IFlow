import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line no-undef
const target = process.env.VITE_API_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      // Encaminha /api/* para o backend (remove o prefixo /api)
      "/api": {
        target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
