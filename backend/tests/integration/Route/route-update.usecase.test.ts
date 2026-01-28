import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaRouteRepository } from "../../../src/infrastructure/database/prisma/PrismaRouteRepository.js";
import { CreateRouteUseCase } from "../../../src/application/use-cases/route/CreateRouteUseCase.js";
import { UpdateRouteUseCase } from "../../../src/application/use-cases/route/UpdateRouteUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: UpdateRouteUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve atualizar uma rota e persistir no banco", async () => {
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    const routeRepository = new PrismaRouteRepository(prisma);

    // 🔹 cria primeiro (via usecase)
    const createUseCase = new CreateRouteUseCase(routeRepository);

    const created = await createUseCase.execute({
      name: "Rota Norte",
      collectionType: "Coleta regular",
      collectionDays: ["monday", "wednesday", "friday"],
      startTime: "14:00",
      endTime: "15:00",
      adminId: admin.id,
    });

    // ✅ update: execute(id, dto)
    const updateUseCase = new UpdateRouteUseCase(routeRepository);

    const updated = await updateUseCase.execute(created.id, {
      name: "Rota Norte Atualizada",
      collectionDays: ["tuesday", "thursday"],
      startTime: "15:00",
      endTime: "16:00",
      adminId: admin.id,
    });

    expect(updated.id).toBe(created.id);

    const routeDb = await prisma.route.findUnique({
      where: { id: created.id },
    });

    expect(routeDb).not.toBeNull();
    expect(routeDb?.name).toBe("Rota Norte Atualizada");
    expect(routeDb?.admin_id_updated).toBe(admin.id);
    expect(routeDb?.collection_days).toContain("tuesday");
    expect(routeDb?.collection_time).toContain("15:00");
    expect(routeDb?.collection_time).toContain("16:00");
  });
});
