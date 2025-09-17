import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import itemsRouter from "./routes/item.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/auth", meRoutes); // /auth/me
app.use("/items", itemsRouter);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
