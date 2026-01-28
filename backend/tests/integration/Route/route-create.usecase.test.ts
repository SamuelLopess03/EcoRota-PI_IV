import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaRouteRepository } from "../../../src/infrastructure/database/prisma/PrismaRouteRepository.js";
import { CreateRouteUseCase } from "../../../src/application/use-cases/route/CreateRouteUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: CreateRouteUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve criar uma rota e persistir no banco", async () => {
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    const routeRepository = new PrismaRouteRepository(prisma);
    const usecase = new CreateRouteUseCase(routeRepository);

    const output = await usecase.execute({
      name: "Rota Norte",
      collectionType: "Coleta regular",
      collectionDays: ["monday", "wednesday", "friday"],
      startTime: "14:00",
      endTime: "15:00",
      adminId: admin.id,
    });

    expect(output.id).toBeTruthy();

    const routeDb = await prisma.route.findUnique({
      where: { id: output.id },
    });

    expect(routeDb).not.toBeNull();
    expect(routeDb?.name).toBe("Rota Norte");
    expect(routeDb?.admin_id_created).toBe(admin.id);
    expect(routeDb?.collection_days).toContain("monday");
    expect(routeDb?.collection_time).toContain("14:00");
    expect(routeDb?.collection_time).toContain("15:00");
  });
});
