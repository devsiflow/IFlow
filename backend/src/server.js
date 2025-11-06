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

// ✅ CORS configurado corretamente (localhost + Vercel)
const allowedOrigins = [
  "http://localhost:5173", // ambiente local
  "https://iflow.vercel.app",
  "https://www.iflowapp.com.br" // produção
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

// ✅ Rotas principais
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/api/admin", adminRoutes);
app.use("/itemValidation", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

// ✅ Servir frontend (em produção)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // ⚡ Compatível com Express 5 (sem pathToRegexpError)
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/auth") &&
      !req.path.startsWith("/api") &&
      !req.path.startsWith("/items") &&
      !req.path.startsWith("/admin") &&
      !req.path.startsWith("/dashboard") &&
      !req.path.startsWith("/itemValidation") &&
      !req.path.startsWith("/me")
    ) {
      res.sendFile(path.join(frontendPath, "index.html"));
    } else {
      next();
    }
  });
}

// ✅ Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
