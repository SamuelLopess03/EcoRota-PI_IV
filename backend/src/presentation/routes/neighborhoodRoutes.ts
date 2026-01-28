import { Router } from "express";
import { NeighborhoodController } from "../controllers/NeighborhoodController.js";
import { CreateNeighborhoodUseCase } from "../../application/use-cases/neighborhood/CreateNeighborhoodUseCase.js";
import { ListNeighborhoodsUseCase } from "../../application/use-cases/neighborhood/ListNeighborhoodsUseCase.js";
import { FindNeighborhoodByIdUseCase } from "../../application/use-cases/neighborhood/FindNeighborhoodByIdUseCase.js";
import { UpdateNeighborhoodUseCase } from "../../application/use-cases/neighborhood/UpdateNeighborhoodUseCase.js";
import { DeleteNeighborhoodUseCase } from "../../application/use-cases/neighborhood/DeleteNeighborhoodUseCase.js";
import { PrismaNeighborhoodRepository } from "../../infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { PrismaRouteRepository } from "../../infrastructure/database/prisma/PrismaRouteRepository.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";

const neighborhoodRoutes = Router();

// Injeção de Dependências
const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);
const routeRepository = new PrismaRouteRepository(prisma);
const administratorRepository = new PrismaAdministratorRepository(prisma);
const tokenProvider = new JwtTokenProvider();

const createNeighborhoodUseCase = new CreateNeighborhoodUseCase(neighborhoodRepository, routeRepository);
const listNeighborhoodsUseCase = new ListNeighborhoodsUseCase(neighborhoodRepository);
const findNeighborhoodByIdUseCase = new FindNeighborhoodByIdUseCase(neighborhoodRepository);
const updateNeighborhoodUseCase = new UpdateNeighborhoodUseCase(neighborhoodRepository, routeRepository);
const deleteNeighborhoodUseCase = new DeleteNeighborhoodUseCase(neighborhoodRepository);

const neighborhoodController = new NeighborhoodController(
    createNeighborhoodUseCase,
    listNeighborhoodsUseCase,
    findNeighborhoodByIdUseCase,
    updateNeighborhoodUseCase,
    deleteNeighborhoodUseCase
);

const authMiddleware = ensureAuthenticated(tokenProvider, administratorRepository);

// Mapeamento de Rotas
neighborhoodRoutes.post("/neighborhoods", authMiddleware, (req, res) => neighborhoodController.create(req, res));
neighborhoodRoutes.get("/neighborhoods", (req, res) => neighborhoodController.list(req, res));
neighborhoodRoutes.get("/neighborhoods/:id", (req, res) => neighborhoodController.findById(req, res));
neighborhoodRoutes.put("/neighborhoods/:id", authMiddleware, (req, res) => neighborhoodController.update(req, res));
neighborhoodRoutes.delete("/neighborhoods/:id", authMiddleware, (req, res) => neighborhoodController.delete(req, res));

export { neighborhoodRoutes };
