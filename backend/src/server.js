// ✅ backend/src/server.js

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

// ✅ CORS configurado corretamente (localhost + produção)
const allowedOrigins = [
  "http://localhost:5173", // ambiente local
  "https://iflow.vercel.app", // Vercel
  "https://www.iflowapp.com.br", // domínio próprio
  "https://iflowapp.com.br", // sem www
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS bloqueado para origem:", origin);
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ __dirname e __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Rotas principais da API
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/admin", adminRoutes);
app.use("/itemValidation", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

// ✅ Produção: Render serve apenas a API (frontend está no Vercel)
if (process.env.NODE_ENV === "production") {
  console.log("🌐 Modo produção: servindo apenas a API (frontend hospedado separadamente)");
}

// ✅ Endpoint básico de verificação
app.get("/", (req, res) => {
  res.json({ message: "🚀 API iFlow rodando com sucesso!" });
});

// ✅ Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
