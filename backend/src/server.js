import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://iflow.vercel.app", "https://i-flow-be84dvn7v-iflows-projects-1a4d9c28.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // se precisar enviar cookies
  })
);

app.use(express.json());

// Rotas
app.use("/auth", authRoutes);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
