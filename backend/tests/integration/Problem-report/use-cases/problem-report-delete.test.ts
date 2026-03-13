import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ReportProblemUseCase } from "../../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { DeleteProblemReportUseCase } from "../../../../src/application/use-cases/problem-report/DeleteProblemReportUseCase.js";
import { resetDatabase } from "../../../setup-db.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("Integration: DeleteProblemReportUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve deletar um reporte de problema e remover do banco", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin de Relatos", email: "admin.relatos@ecorota.com", password: "password456" },
    });

    const route = await prisma.route.create({
      data: {
        name: "Rota Sul",
        collection_type: "Coleta regular",
        collection_days: "monday,wednesday",
        collection_time: "14:00 - 15:00",
        admin_id_created: admin.id,
      },
    });

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro Novo",
        latitude: -5.17,
        longitude: -40.66,
        cep: "63700-111",
        route_id: route.id,
        admin_id_created: admin.id,
      },
    });

    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const neighborhoodRepo = new PrismaNeighborhoodRepository(prisma);
    const registerSubscriber = new RegisterSubscriberUseCase(subscriberRepo, neighborhoodRepo);

    const subscriber = await registerSubscriber.execute({
      email: "cidadao.delecao@teste.com",
      street: "Avenida das Américas",
      neighborhoodId: neighborhood.id,
      number: "500",
      postalCode: "63700-111",
    });

    const problemRepo = new PrismaProblemReportRepository(prisma);
    const reportProblem = new ReportProblemUseCase(problemRepo, subscriberRepo);

    const reported = await reportProblem.execute({
      description: "Lixo acumulado na rua",
      problemType: "Coleta não realizada",
      attachments: ["img1.png"],
      subscriberId: subscriber.id,
    });

    const deleteProblem = new DeleteProblemReportUseCase(problemRepo);
    await deleteProblem.execute(reported.id);

    const db = await prisma.reportedProblem.findUnique({
      where: { id: reported.id },
    });

    expect(db).toBeNull();
  }, 30000);

  it("deve lançar EntityNotFoundError ao deletar um relato inexistente", async () => {
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const deleteProblem = new DeleteProblemReportUseCase(problemRepo);

    const invalidId = 9999;
    const promise = deleteProblem.execute(invalidId);

    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow(`Relato de Problema com identificador '${invalidId}' não foi encontrado.`);
  }, 30000);
});
