import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import itemsRouter from "./routes/item.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rotas
app.use("/auth", authRoutes);   // login, register etc.
app.use("/me", meRoutes);       // GET /me e PUT /me
app.use("/items", itemsRouter); // itens do banco de itens
app.use("/admin", adminRoutes); // rota protegida para admins


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
