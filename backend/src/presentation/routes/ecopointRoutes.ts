import { Router } from "express";
import { EcopointController } from "../controllers/EcopointController.js";
import { CreateEcopointUseCase } from "../../application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { ListEcopointsUseCase } from "../../application/use-cases/ecopoint/ListEcopointsUseCase.js";
import { FindEcopointByIdUseCase } from "../../application/use-cases/ecopoint/FindEcopointByIdUseCase.js";
import { UpdateEcopointUseCase } from "../../application/use-cases/ecopoint/UpdateEcopointUseCase.js";
import { DeleteEcopointUseCase } from "../../application/use-cases/ecopoint/DeleteEcopointUseCase.js";
import { PrismaEcopointRepository } from "../../infrastructure/database/prisma/PrismaEcopointRepository.js";
import { PrismaNeighborhoodRepository } from "../../infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";

const ecopointRoutes = Router();

// Injeção de Dependências
const ecopointRepository = new PrismaEcopointRepository(prisma);
const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);
const administratorRepository = new PrismaAdministratorRepository(prisma);
const tokenProvider = new JwtTokenProvider();

const createEcopointUseCase = new CreateEcopointUseCase(ecopointRepository, neighborhoodRepository);
const listEcopointsUseCase = new ListEcopointsUseCase(ecopointRepository);
const findEcopointByIdUseCase = new FindEcopointByIdUseCase(ecopointRepository);
const updateEcopointUseCase = new UpdateEcopointUseCase(ecopointRepository, neighborhoodRepository);
const deleteEcopointUseCase = new DeleteEcopointUseCase(ecopointRepository);

const ecopointController = new EcopointController(
    createEcopointUseCase,
    listEcopointsUseCase,
    findEcopointByIdUseCase,
    updateEcopointUseCase,
    deleteEcopointUseCase
);

const authMiddleware = ensureAuthenticated(tokenProvider, administratorRepository);

// Mapeamento de Rotas
ecopointRoutes.post("/ecopoints", authMiddleware, (req, res) => ecopointController.create(req, res));
ecopointRoutes.get("/ecopoints", (req, res) => ecopointController.list(req, res));
ecopointRoutes.get("/ecopoints/:id", (req, res) => ecopointController.findById(req, res));
ecopointRoutes.put("/ecopoints/:id", authMiddleware, (req, res) => ecopointController.update(req, res));
ecopointRoutes.delete("/ecopoints/:id", authMiddleware, (req, res) => ecopointController.delete(req, res));

export { ecopointRoutes };
