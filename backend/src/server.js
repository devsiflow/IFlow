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

// 🔒 Configuração CORS (ESSENCIAL para o dashboard funcionar com cookies)
const allowedOrigins = [
  "http://localhost:5173", // ambiente local (Vite)
  "https://iflow.vercel.app", // produção (Vercel)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sem origem (ex: Postman) ou dos domínios listados
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS bloqueado para origem:", origin);
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true, // permite cookies/autenticação
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Rotas
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/admin", adminRoutes);
app.use("/itemValidation", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

// ✅ Servir o frontend (em produção)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Wildcard pra SPA (React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ✅ Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
