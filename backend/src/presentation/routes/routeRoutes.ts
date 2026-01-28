import { Router } from "express";
import { RouteController } from "../controllers/RouteController.js";
import { CreateRouteUseCase } from "../../application/use-cases/route/CreateRouteUseCase.js";
import { ListRoutesUseCase } from "../../application/use-cases/route/ListRoutesUseCase.js";
import { FindRouteByIdUseCase } from "../../application/use-cases/route/FindRouteByIdUseCase.js";
import { UpdateRouteUseCase } from "../../application/use-cases/route/UpdateRouteUseCase.js";
import { DeleteRouteUseCase } from "../../application/use-cases/route/DeleteRouteUseCase.js";
import { PrismaRouteRepository } from "../../infrastructure/database/prisma/PrismaRouteRepository.js";
import { PrismaNeighborhoodRepository } from "../../infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";

const routeRoutes = Router();

// Injeção de Dependências
const routeRepository = new PrismaRouteRepository(prisma);
const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);
const administratorRepository = new PrismaAdministratorRepository(prisma);
const tokenProvider = new JwtTokenProvider();

const createRouteUseCase = new CreateRouteUseCase(routeRepository);
const listRoutesUseCase = new ListRoutesUseCase(routeRepository);
const findRouteByIdUseCase = new FindRouteByIdUseCase(routeRepository, neighborhoodRepository);
const updateRouteUseCase = new UpdateRouteUseCase(routeRepository);
const deleteRouteUseCase = new DeleteRouteUseCase(routeRepository, neighborhoodRepository);

const routeController = new RouteController(
    createRouteUseCase,
    listRoutesUseCase,
    findRouteByIdUseCase,
    updateRouteUseCase,
    deleteRouteUseCase
);

const authMiddleware = ensureAuthenticated(tokenProvider, administratorRepository);

// Mapeamento de Rotas
routeRoutes.post("/routes", authMiddleware, (req, res) => routeController.create(req, res));
routeRoutes.get("/routes", (req, res) => routeController.list(req, res));
routeRoutes.get("/routes/:id", (req, res) => routeController.findById(req, res));
routeRoutes.put("/routes/:id", authMiddleware, (req, res) => routeController.update(req, res));
routeRoutes.delete("/routes/:id", authMiddleware, (req, res) => routeController.delete(req, res));

export { routeRoutes };
