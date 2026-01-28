import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaEcopointRepository } from "../../../src/infrastructure/database/prisma/PrismaEcopointRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { CreateEcopointUseCase } from "../../../src/application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { DeleteEcopointUseCase } from "../../../src/application/use-cases/ecopoint/DeleteEcopointUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: DeleteEcopointUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve deletar um ecoponto e remover do banco", async () => {
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

    const ecopointRepository = new PrismaEcopointRepository(prisma);
    const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);

    const createUseCase = new CreateEcopointUseCase(
      ecopointRepository,
      neighborhoodRepository
    );

    const created = await createUseCase.execute({
      name: "Ecoponto Centro",
      materials: ["glass", "plastic"],
      street: "Rua A",
      number: "123",
      postalCode: "63700-111",
      latitude: -5.171,
      longitude: -40.661,
      collectionDays: ["monday", "wednesday"],
      startTime: "08:00",
      endTime: "12:00",
      neighborhoodId: neighborhood.id,
      adminId: admin.id,
    });

    // ✅ delete: execute(id)
    const deleteUseCase = new DeleteEcopointUseCase(ecopointRepository);
    await deleteUseCase.execute(created.id);

    const ecopointDb = await prisma.ecopoint.findUnique({
      where: { id: created.id },
    });

    expect(ecopointDb).toBeNull();
  });
});
