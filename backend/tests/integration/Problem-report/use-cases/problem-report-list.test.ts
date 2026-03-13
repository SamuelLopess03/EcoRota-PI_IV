import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaProblemReportRepository } from "../../../../src/infrastructure/database/prisma/PrismaProblemReportRepository.js";
import { ListReportedProblemsUseCase } from "../../../../src/application/use-cases/problem-report/ListReportedProblemsUseCase.js";
import { resetDatabase } from "../../../setup-db.js";

describe("Integration: ListReportedProblemsUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve listar problemas filtrando por status", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin Listagem", email: "admin.list@ecorota.com", password: "password123" }
    });
    const route = await prisma.route.create({
      data: { name: "Rota de Teste Status", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
      data: { name: "Bairro de Teste Status", latitude: -3.7, longitude: -38.5, cep: "60000-000", route_id: route.id, admin_id_created: admin.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "usuario.status@teste.com", street: "Rua do Status", neighborhood_id: neighborhood.id }
    });

    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0001", description: "Descrição do problema 1 (Pendente) longa o suficiente", problem_type: "Coleta não realizada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });
    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0002", description: "Descrição do problema 2 (Resolvido) longa o suficiente", problem_type: "Coleta não realizada", status: "RESOLVED", url_attachments: "[]", subscriber_id: sub.id }
    });

    const problemRepo = new PrismaProblemReportRepository(prisma);
    const usecase = new ListReportedProblemsUseCase(problemRepo);

    const pending = await usecase.execute({ status: "PENDING" });
    expect(pending.length).toBe(1);
    expect(pending[0].protocol).toBe("PR-2026-0001");

    const resolved = await usecase.execute({ status: "RESOLVED" });
    expect(resolved.length).toBe(1);
    expect(resolved[0].protocol).toBe("PR-2026-0002");
  }, 30000);

  it("deve listar todos se nenhum filtro for passado", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin Teste Geral", email: "admin2@teste.com", password: "password123" }
    });
    const route = await prisma.route.create({
        data: { name: "Rota Geral", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Geral", latitude: -3.8, longitude: -38.6, cep: "60000-111", route_id: route.id, admin_id_created: admin.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "usuario2@teste.com", street: "Rua Geral", neighborhood_id: neighborhood.id }
    });

    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0003", description: "Descrição do problema 3 longa o suficiente", problem_type: "Coleta não realizada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0004", description: "Descrição do problema 4 longa o suficiente", problem_type: "Lixeira danificada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    const problemRepo = new PrismaProblemReportRepository(prisma);
    const usecase = new ListReportedProblemsUseCase(problemRepo);

    const all = await usecase.execute({});
    expect(all.length).toBe(2);
  }, 30000);
});
