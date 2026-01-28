import { Router } from "express";
import { ProblemReportController } from "../controllers/ProblemReportController.js";
import { ReportProblemUseCase } from "../../application/use-cases/problem-report/ReportProblemUseCase.js";
import { ListReportedProblemsUseCase } from "../../application/use-cases/problem-report/ListReportedProblemsUseCase.js";
import { ResolveProblemUseCase } from "../../application/use-cases/problem-report/ResolveProblemUseCase.js";
import { UpdateProblemReportUseCase } from "../../application/use-cases/problem-report/UpdateProblemReportUseCase.js";
import { DeleteProblemReportUseCase } from "../../application/use-cases/problem-report/DeleteProblemReportUseCase.js";
import { PrismaProblemReportRepository } from "../../infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaAdministratorRepository } from "../../infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { prisma } from "../../infrastructure/database/prismaClient.js";
import { ensureAuthenticated } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";
import { JwtTokenProvider } from "../../infrastructure/providers/JwtTokenProvider.js";

const problemReportRoutes = Router();

// Injeção de Dependências
const problemReportRepository = new PrismaProblemReportRepository(prisma);
const subscriberRepository = new PrismaSubscriberRepository(prisma);
const administratorRepository = new PrismaAdministratorRepository(prisma);
const tokenProvider = new JwtTokenProvider();

const reportProblemUseCase = new ReportProblemUseCase(problemReportRepository, subscriberRepository);
const listReportedProblemsUseCase = new ListReportedProblemsUseCase(problemReportRepository);
const resolveProblemUseCase = new ResolveProblemUseCase(problemReportRepository, administratorRepository);
const updateProblemReportUseCase = new UpdateProblemReportUseCase(problemReportRepository, subscriberRepository);
const deleteProblemReportUseCase = new DeleteProblemReportUseCase(problemReportRepository);

const problemReportController = new ProblemReportController(
    reportProblemUseCase,
    listReportedProblemsUseCase,
    resolveProblemUseCase,
    updateProblemReportUseCase,
    deleteProblemReportUseCase
);

const authMiddleware = ensureAuthenticated(tokenProvider, administratorRepository);

// Mapeamento de Rotas
problemReportRoutes.post("/problem-reports", (req, res) => problemReportController.report(req, res));
problemReportRoutes.get("/problem-reports", authMiddleware, (req, res) => problemReportController.list(req, res));
problemReportRoutes.patch("/problem-reports/:id/resolve", authMiddleware, (req, res) => problemReportController.resolve(req, res));
problemReportRoutes.put("/problem-reports/:id", authMiddleware, (req, res) => problemReportController.update(req, res));
problemReportRoutes.delete("/problem-reports/:id", authMiddleware, (req, res) => problemReportController.delete(req, res));

export { problemReportRoutes };
