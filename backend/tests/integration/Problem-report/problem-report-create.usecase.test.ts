import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ReportProblemUseCase } from "../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: ReportProblemUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve criar um reporte de problema e persistir no banco", async () => {
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    // 🔹 rota (pré-requisito)
    const route = await prisma.route.create({
      data: {
        name: "Rota Sul",
        collection_type: "CONVENCIONAL",
        collection_days: "monday,wednesday",
        collection_time: "14:00 - 15:00",
        admin_id_created: admin.id,
      },
    });

    // 🔹 bairro (pré-requisito)
    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Centro",
        latitude: -5.178,
        longitude: -40.669,
        cep: "63700-000",
        route_id: route.id,
        admin_id_created: admin.id,
      },
    });

    // 🔹 subscriber (via usecase)
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
      postalCode: "63700-000",
    });

    // 🔹 problem report (create)
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const usecase = new ReportProblemUseCase(problemRepo, subscriberRepo);

    const output = await usecase.execute({
      description: "Lixo acumulado na rua",
      problemType: "Coleta não realizada",
      attachments: ["img1.png"],
      subscriberId: subscriber.id,
    });

    expect(output.id).toBeTruthy();

    const db = await prisma.reportedProblem.findUnique({
      where: { id: output.id },
    });

    expect(db).not.toBeNull();
    expect(db?.description).toBe("Lixo acumulado na rua");
    expect(db?.subscriber_id).toBe(subscriber.id);
    expect(db?.url_attachments).toContain("img1.png");
  });
});
