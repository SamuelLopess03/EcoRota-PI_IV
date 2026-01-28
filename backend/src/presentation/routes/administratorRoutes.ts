import { Router } from "express";
import { AdministratorController } from "../controllers/AdministratorController.js";
import { CreateAdministratorUseCase } from "../../application/use-cases/administrator/CreateAdministratorUseCase.js";
import { AuthenticateAdministratorUseCase } from "../../application/use-cases/administrator/AuthenticateAdministratorUseCase.js";
import { ListAdministratorsUseCase } from "../../application/use-cases/administrator/ListAdministratorsUseCase.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { BCryptHashProvider } from "../../infrastructure/providers/BCryptHashProvider.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";

const administratorRoutes = Router();

// Injeção de Dependências (Poderia ser movida para uma Factory futuramente)
const administratorRepository = new PrismaAdministratorRepository(prisma);
const hashProvider = new BCryptHashProvider();
const tokenProvider = new JwtTokenProvider();

const createAdministratorUseCase = new CreateAdministratorUseCase(administratorRepository, hashProvider);
const authenticateAdministratorUseCase = new AuthenticateAdministratorUseCase(administratorRepository, hashProvider, tokenProvider);
const listAdministratorsUseCase = new ListAdministratorsUseCase(administratorRepository);

const authenticated = ensureAuthenticated(tokenProvider, administratorRepository);

const administratorController = new AdministratorController(
    createAdministratorUseCase,
    authenticateAdministratorUseCase,
    listAdministratorsUseCase
);

// Mapeamento de Rotas
administratorRoutes.post("/administrators", authenticated, (req, res) => administratorController.register(req, res));
administratorRoutes.post("/auth/login", (req, res) => administratorController.login(req, res));
administratorRoutes.get("/administrators", authenticated, (req, res) => administratorController.list(req, res));

export { administratorRoutes };
