import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { PrismaAdministratorRepository } from "../../../../src/infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { ResolveProblemUseCase } from "../../../../src/application/use-cases/problem-report/ResolveProblemUseCase.js";
import { resetDatabase } from "../../../setup-db.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("Integration: ResolveProblemUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve resolver um problema e atualizar o status no banco", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin Supervisor", email: "supervisor@ecorota.com", password: "password789" },
    });

    const route = await prisma.route.create({
      data: {
        name: "Rota R1", collection_type: "Coleta regular", collection_days: "monday", 
        collection_time: "08:00 - 09:00", admin_id_created: admin.id
      }
    });

    const neighborhood = await prisma.neighborhood.create({
      data: { name: "Bairro Industrial", latitude: 1, longitude: 1, cep: "63700-555", route_id: route.id, admin_id_created: admin.id }
    });

    const subscriber = await prisma.subscriber.create({
      data: { email: "usuario.resolve@teste.com", street: "Rua Industrial Principal", neighborhood_id: neighborhood.id }
    });

    const reported = await prisma.reportedProblem.create({
      data: {
        protocol: "PR-2026-0001",
        description: "Vazamento de resíduos químicos na via pública",
        problem_type: "Outros",
        status: "PENDING",
        url_attachments: "[]",
        subscriber_id: subscriber.id
      }
    });

    const problemRepo = new PrismaProblemReportRepository(prisma);
    const adminRepo = new PrismaAdministratorRepository(prisma);
    const usecase = new ResolveProblemUseCase(problemRepo, adminRepo);

    const output = await usecase.execute(reported.id, {
      status: "RESOLVED",
      justification: "Realizado o check na rua e estava tudo ok",
      adminId: admin.id
    });

    expect(output.status).toBe("RESOLVED");
    expect(output.resolvedByAdminId).toBe(admin.id);
    expect(output.justification).toBe("Realizado o check na rua e estava tudo ok");

    const db = await prisma.reportedProblem.findUnique({ where: { id: reported.id } });
    expect(db?.status).toBe("RESOLVED");
    expect(db?.resolved_by_admin_id).toBe(admin.id);
  }, 30000);

  it("deve lançar EntityNotFoundError se o administrador não existir", async () => {
    const problemRepo = new PrismaProblemReportRepository(prisma);
    const adminRepo = new PrismaAdministratorRepository(prisma);
    const usecase = new ResolveProblemUseCase(problemRepo, adminRepo);

    const invalidAdminId = 9999;
    const promise = usecase.execute(1, {
      status: "RESOLVED",
      adminId: invalidAdminId
    });

    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow(`Administrador com identificador '${invalidAdminId}' não foi encontrado.`);
  }, 30000);
});
