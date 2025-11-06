import express from "express";
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

// ✅ CORS manual — resolve erro 500 no preflight (Render, etc)
const allowedOrigins = [
  "http://localhost:5173",
  "https://iflow.vercel.app",
  "https://iflowapp.com.br",
  "https://www.iflowapp.com.br",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // 👇 Se for preflight (OPTIONS), responde direto e encerra
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// ✅ __dirname e __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Rotas principais
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/admin", adminRoutes);
app.use("/itemValidation", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

// ✅ Servir frontend (em produção)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/auth") &&
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
