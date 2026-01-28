import express from "express";
import cors from "cors";
import { ErrorHandler } from "./infrastructure/http/middlewares/ErrorHandler.js";

const app = express();

// Middlewares essenciais
app.use(
    cors({
        origin: "*", // Em produção, isto deve ser restrito
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Rotas do Administrador
import { administratorRoutes } from "./presentation/routes/administratorRoutes.js";
app.use(administratorRoutes);

// Rotas de Bairros (Neighborhoods)
import { neighborhoodRoutes } from "./presentation/routes/neighborhoodRoutes.js";
app.use(neighborhoodRoutes);

// Rota de Health Check
app.get("/ping", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Resposta padrão para rotas não encontradas
app.use((req, res, next) => {
    if (req.path === "/") {
        res.send("Bem-Vindo a EcoRota!");
        return;
    }
    next();
});

// Handler de Erros Global (Deve ser o último a ser registrado)
app.use(ErrorHandler);

export { app };
