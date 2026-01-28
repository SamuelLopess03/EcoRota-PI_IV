import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaRouteRepository } from "../../../src/infrastructure/database/prisma/PrismaRouteRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { CreateRouteUseCase } from "../../../src/application/use-cases/route/CreateRouteUseCase.js";
import { DeleteRouteUseCase } from "../../../src/application/use-cases/route/DeleteRouteUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: DeleteRouteUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve deletar uma rota (sem bairros vinculados) e remover do banco", async () => {
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    const routeRepository = new PrismaRouteRepository(prisma);
    const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);

    // 🔹 cria primeiro (via usecase) — NÃO cria bairro pra não dar conflito
    const createUseCase = new CreateRouteUseCase(routeRepository);

    const created = await createUseCase.execute({
      name: "Rota Sem Bairros",
      collectionType: "Coleta regular",
      collectionDays: ["monday"],
      startTime: "10:00",
      endTime: "11:00",
      adminId: admin.id,
    });

    // ✅ delete: execute(id)
    const deleteUseCase = new DeleteRouteUseCase(
      routeRepository,
      neighborhoodRepository
    );

    await deleteUseCase.execute(created.id);

    const routeDb = await prisma.route.findUnique({
      where: { id: created.id },
    });

    expect(routeDb).toBeNull();
  });
});
