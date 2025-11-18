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
import campusRouter from "./routes/campus.js";
import solicitacoesRoutes from "./routes/solicitacoes.js";

dotenv.config();

const app = express();
app.use(express.json());

// ==========================
// 🧩 Configuração CORS
// ==========================
const allowedOriginsEnv = process.env.FRONTEND_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter((s) => /^https?:\/\//.test(s));

console.log("FRONTEND_ORIGINS:", process.env.FRONTEND_ORIGINS);
console.log("allowedOrigins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
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
app.use("/campus", campusRouter);
app.use("/solicitacoes", solicitacoesRoutes);

// ==========================
// Porta
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

export default app;
