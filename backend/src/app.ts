import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import { administratorRoutes } from "./presentation/routes/administratorRoutes.js";
import { subscriberRoutes } from "./presentation/routes/subscriberRoutes.js";
import { problemReportRoutes } from "./presentation/routes/problemReportRoutes.js";
import { uploadRoutes } from "./presentation/routes/uploadRoutes.js";
import { routeRoutes } from "./presentation/routes/routeRoutes.js";
import { neighborhoodRoutes } from "./presentation/routes/neighborhoodRoutes.js";
import { ecopointRoutes } from "./presentation/routes/ecopointRoutes.js";

import { ErrorHandler } from "./infrastructure/http/middlewares/ErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "..", "public", "uploads")));

app.use(administratorRoutes);
app.use(subscriberRoutes);
app.use(uploadRoutes);
app.use(problemReportRoutes);
app.use(routeRoutes);
app.use(neighborhoodRoutes);
app.use(ecopointRoutes);

app.use((req, res, next) => {
    if (req.path === "/") {
        res.send("Bem-Vindo a EcoRota!");
        return;
    }
    next();
});

app.use(ErrorHandler);

export { app };
