import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import itemsRouter from "./routes/item.js";
import adminRoutes from "./routes/admin.js";
import itemValidationRoutes from "./routes/itemValidation.js";
import dashboardRouter from "./routes/dashboard.js";
import superadminRoutes from "./routes/superadmin.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Expor uploads (se necessário)
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rotas
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/items", itemsRouter);
app.use("/admin", adminRoutes);
app.use("/superadmin", superadminRoutes);
app.use("/validacao", itemValidationRoutes);
app.use("/dashboard", dashboardRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
