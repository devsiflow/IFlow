import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import itemsRouter from "./routes/item.js";
import adminRoutes from "./routes/admin.js";
import itemValidationRoutes from "./routes/itemValidation.js";
import dashboardRouter from "./routes/dashboard.js";

dotenv.config();

const app = express();
app.use(express.json());

// ==========================
// 🧩 Configuração CORS robusta
// ==========================
const allowedOriginsEnv = process.env.FRONTEND_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter((s) => /^https?:\/\//.test(s)); // só URLs válidas

console.log("FRONTEND_ORIGINS:", process.env.FRONTEND_ORIGINS);
console.log("allowedOrigins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sem origem (Postman, curl, SSR)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn("🚫 CORS bloqueado:", origin);
      return callback(new Error("Origem não permitida"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ==========================
// __dirname para ESM
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// Rotas principais
// ==========================
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/admin", adminRoutes);
app.use("/itemValidation", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

// ==========================
// Servir frontend buildado (produção)
// ==========================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("/*", (req, res, next) => {
    const url = req.path || "";
    const apiPrefixes = [
      "/auth",
      "/me",
      "/items",
      "/admin",
      "/dashboard",
      "/itemValidation",
    ];
    const isApi = apiPrefixes.some((p) => url.startsWith(p));

    if (!isApi) {
      return res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) {
          console.error("Erro ao servir index.html:", err);
          next();
        }
      });
    } else next();
  });
}

// ==========================
// Porta
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

export default app;
