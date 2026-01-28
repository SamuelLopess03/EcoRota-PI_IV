import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ReportProblemUseCase } from "../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { UpdateProblemReportUseCase } from "../../../src/application/use-cases/problem-report/UpdateProblemReportUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: UpdateProblemReportUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve atualizar um reporte de problema e persistir no banco", async () => {
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
      postalCode: "63700-111",
    });

    // 🔹 report problem (via usecase)
    const problemRepo = new PrismaProblemReportRepository(prisma);

    const reportProblem = new ReportProblemUseCase(problemRepo, subscriberRepo);

    const reported = await reportProblem.execute({
      description: "Lixo acumulado na rua",
      problemType: "Lixeira danificada",
      attachments: ["img1.png"],
      subscriberId: subscriber.id,
    });

    // ✅ update: execute(id, dto)
    const updateProblem = new UpdateProblemReportUseCase(
      problemRepo,
      subscriberRepo
    );

    const updated = await updateProblem.execute(reported.id, {
      description: "Lixo acumulado há 3 dias",
      attachments: ["img1.png", "img2.png"],
    });

    expect(updated.id).toBe(reported.id);

    const db = await prisma.reportedProblem.findUnique({
      where: { id: reported.id },
    });

    expect(db).not.toBeNull();
    expect(db?.description).toBe("Lixo acumulado há 3 dias");
    expect(db?.url_attachments).toContain("img2.png");
  });
});
