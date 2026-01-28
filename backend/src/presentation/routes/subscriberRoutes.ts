import { Router } from "express";
import { SubscriberController } from "../controllers/SubscriberController.js";
import { RegisterSubscriberUseCase } from "../../application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ListSubscribersUseCase } from "../../application/use-cases/subscriber/ListSubscribersUseCase.js";
import { FindSubscriberByIdUseCase } from "../../application/use-cases/subscriber/FindSubscriberByIdUseCase.js";
import { UpdateSubscriberProfileUseCase } from "../../application/use-cases/subscriber/UpdateSubscriberProfileUseCase.js";
import { UnsubscribeUseCase } from "../../application/use-cases/subscriber/UnsubscribeUseCase.js";
import { PrismaSubscriberRepository } from "../../infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";

const subscriberRoutes = Router();

// Injeção de Dependências
const subscriberRepository = new PrismaSubscriberRepository(prisma);
const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);
const administratorRepository = new PrismaAdministratorRepository(prisma);
const tokenProvider = new JwtTokenProvider();

const registerSubscriberUseCase = new RegisterSubscriberUseCase(subscriberRepository, neighborhoodRepository);
const listSubscribersUseCase = new ListSubscribersUseCase(subscriberRepository);
const findSubscriberByIdUseCase = new FindSubscriberByIdUseCase(subscriberRepository);
const updateSubscriberProfileUseCase = new UpdateSubscriberProfileUseCase(subscriberRepository, neighborhoodRepository);
const unsubscribeUseCase = new UnsubscribeUseCase(subscriberRepository);

const subscriberController = new SubscriberController(
    registerSubscriberUseCase,
    listSubscribersUseCase,
    findSubscriberByIdUseCase,
    updateSubscriberProfileUseCase,
    unsubscribeUseCase
);

const authMiddleware = ensureAuthenticated(tokenProvider, administratorRepository);

// Mapeamento de Rotas
subscriberRoutes.post("/subscribers", (req, res) => subscriberController.register(req, res));
subscriberRoutes.get("/subscribers", (req, res) => subscriberController.list(req, res));
subscriberRoutes.get("/subscribers/:id", (req, res) => subscriberController.findById(req, res));
subscriberRoutes.put("/subscribers/:id", authMiddleware, (req, res) => subscriberController.update(req, res));
subscriberRoutes.delete("/subscribers/:id", authMiddleware, (req, res) => subscriberController.delete(req, res));

export { subscriberRoutes };
