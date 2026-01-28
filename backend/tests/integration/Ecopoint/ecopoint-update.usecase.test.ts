import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaEcopointRepository } from "../../../src/infrastructure/database/prisma/PrismaEcopointRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { CreateEcopointUseCase } from "../../../src/application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { UpdateEcopointUseCase } from "../../../src/application/use-cases/ecopoint/UpdateEcopointUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: UpdateEcopointUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve atualizar um ecoponto e persistir no banco", async () => {
    // 🔹 admin
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    // 🔹 rota (pré-requisito do bairro)
    const route = await prisma.route.create({
      data: {
        name: "Rota Sul",
        collection_type: "CONVENCIONAL",
        collection_days: "monday,wednesday",
        collection_time: "14:00 - 15:00",
        admin_id_created: admin.id,
      },
    });

    // 🔹 bairro (pré-requisito do ecoponto)
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

    // 🔹 cria primeiro
    const createUseCase = new CreateEcopointUseCase(
      ecopointRepository,
      neighborhoodRepository
    );

    const created = await createUseCase.execute({
      name: "Ecoponto Centro",
      materials: ["glass", "plastic"],
      street: "Rua A",
      number: "123",
      complement: "Próx. à praça",
      postalCode: "63700-111",
      latitude: -5.171,
      longitude: -40.661,
      collectionDays: ["monday", "wednesday"],
      startTime: "08:00",
      endTime: "12:00",
      neighborhoodId: neighborhood.id,
      adminId: admin.id,
    });

    // ✅ update: execute(id, dto)
    const updateUseCase = new UpdateEcopointUseCase(
      ecopointRepository,
      neighborhoodRepository
    );

    const updated = await updateUseCase.execute(created.id, {
      name: "Ecoponto Centro Atualizado",
      materials: ["paper", "metal"],
      collectionDays: ["tuesday", "thursday"],
      startTime: "09:00",
      endTime: "13:00",
      adminId: admin.id,
    });

    expect(updated.id).toBe(created.id);

    const ecopointDb = await prisma.ecopoint.findUnique({
      where: { id: created.id },
    });

    expect(ecopointDb).not.toBeNull();
    expect(ecopointDb?.name).toBe("Ecoponto Centro Atualizado");
    expect(ecopointDb?.admin_id_updated).toBe(admin.id);

    // strings no banco (aceitos/horários/dias) — valida sem depender do formato exato
    expect(ecopointDb?.accepted_materials).toContain("paper");
    expect(ecopointDb?.accepted_materials).toContain("metal");
    expect(ecopointDb?.collection_days).toContain("tuesday");
    expect(ecopointDb?.collection_time).toContain("09:00");
    expect(ecopointDb?.collection_time).toContain("13:00");
  });
});
