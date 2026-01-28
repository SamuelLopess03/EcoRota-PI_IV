import express from "express";
import cors from "cors";

import { administratorRoutes } from "./presentation/routes/administratorRoutes.js";
import { subscriberRoutes } from "./presentation/routes/subscriberRoutes.js";
import { problemReportRoutes } from "./presentation/routes/problemReportRoutes.js";
import { routeRoutes } from "./presentation/routes/routeRoutes.js";
import { neighborhoodRoutes } from "./presentation/routes/neighborhoodRoutes.js";
import { ecopointRoutes } from "./presentation/routes/ecopointRoutes.js";

import { ErrorHandler } from "./infrastructure/http/middlewares/ErrorHandler.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.use(administratorRoutes);
app.use(subscriberRoutes);
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
