import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaSubscriberRepository } from "../../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ReportProblemUseCase } from "../../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { UpdateProblemReportUseCase } from "../../../../src/application/use-cases/problem-report/UpdateProblemReportUseCase.js";
import { resetDatabase } from "../../../setup-db.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

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
    const admin = await prisma.administrador.create({
      data: { name: "Admin de Manutenção", email: "manutencao.admin@ecorota.com", password: "passwordUpdate1" },
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
      email: "cidadao.atualiza@teste.com",
      street: "Avenida das Acácias",
      neighborhoodId: neighborhood.id,
      number: "1234",
      postalCode: "63700-111",
    });

    const problemRepo = new PrismaProblemReportRepository(prisma);
    const reportProblem = new ReportProblemUseCase(problemRepo, subscriberRepo);

    const reported = await reportProblem.execute({
      description: "Lixo acumulado na rua",
      problemType: "Lixeira danificada",
      attachments: ["img1.png"],
      subscriberId: subscriber.id,
    });

    const updateProblem = new UpdateProblemReportUseCase(problemRepo, subscriberRepo);

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
  }, 30000);

  it("deve lançar EntityNotFoundError se o relato não existir", async () => {
    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const usecase = new UpdateProblemReportUseCase(problemRepo, subscriberRepo);

    const invalidId = 9999;
    const promise = usecase.execute(invalidId, {
      description: "Nova descrição válida",
    });

    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow(`Relato de Problema com identificador '${invalidId}' não foi encontrado.`);
  }, 30000);

  it("deve lançar EntityNotFoundError se o novo assinante não existir", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin de Auditoria", email: "auditoria.admin@ecorota.com", password: "auditoriapassword" }
    });
    const route = await prisma.route.create({
      data: { name: "Rota Noroeste", collection_type: "Coleta regular", collection_days: "tuesday,friday", collection_time: "10:00 - 11:30", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
      data: { name: "Bairro Alto da Serra", latitude: -3.75, longitude: -38.52, cep: "60123-456", route_id: route.id, admin_id_created: admin.id }
    });
    const subscriber = await prisma.subscriber.create({
      data: { email: "usuario.auditoria@exemplo.com", street: "Rua da Serra", neighborhood_id: neighborhood.id }
    });
    const reported = await prisma.reportedProblem.create({
      data: {
        protocol: "PR-2026-0001",
        description: "Descrição vailda longa",
        problem_type: "Coleta não realizada",
        status: "PENDING",
        url_attachments: "[]",
        subscriber_id: subscriber.id
      }
    });

    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const usecase = new UpdateProblemReportUseCase(problemRepo, subscriberRepo);

    const invalidSubId = 8888;
    const promise = usecase.execute(reported.id, {
      subscriberId: invalidSubId,
    });

    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow(`Assinante com identificador '${invalidSubId}' não foi encontrado.`);
  }, 30000);
});
