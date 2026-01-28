import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ReportProblemUseCase } from "../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { DeleteProblemReportUseCase } from "../../../src/application/use-cases/problem-report/DeleteProblemReportUseCase.js";
import { resetDatabase } from "../../setup-db.js";

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
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    // 🔹 rota
    const route = await prisma.route.create({
      data: {
        name: "Rota Sul",
        collection_type: "CONVENCIONAL",
        collection_days: "monday,wednesday",
        collection_time: "14:00 - 15:00",
        admin_id_created: admin.id,
      },
    });

    // 🔹 bairro
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

    // 🔹 subscriber
    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const neighborhoodRepo = new PrismaNeighborhoodRepository(prisma);

    const registerSubscriber = new RegisterSubscriberUseCase(
      subscriberRepo,
      neighborhoodRepo
    );

    const subscriber = await registerSubscriber.execute({
      email: "usuario@teste.com",
      street: "Rua A",
      neighborhoodId: neighborhood.id,
      number: "123",
      postalCode: "63700-111",
    });

    // 🔹 report problem
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const reportProblem = new ReportProblemUseCase(problemRepo, subscriberRepo);

    const reported = await reportProblem.execute({
      description: "Lixo acumulado na rua",
      problemType: "Coleta não realizada",
      attachments: ["img1.png"],
      subscriberId: subscriber.id,
    });

    // ✅ delete: execute(id)
    const deleteProblem = new DeleteProblemReportUseCase(problemRepo);
    await deleteProblem.execute(reported.id);

    const db = await prisma.reportedProblem.findUnique({
      where: { id: reported.id },
    });

    expect(db).toBeNull();
  });
});
