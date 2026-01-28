import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaEcopointRepository } from "../../../src/infrastructure/database/prisma/PrismaEcopointRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { CreateEcopointUseCase } from "../../../src/application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: CreateEcopointUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve criar um ecoponto e persistir no banco", async () => {
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
        name: "Rota Norte",
        collection_type: "Coleta regular",
        collection_days: "monday,wednesday,friday",
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

    const ecopointRepository = new PrismaEcopointRepository(prisma);
    const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);

    const usecase = new CreateEcopointUseCase(
      ecopointRepository,
      neighborhoodRepository
    );

    const output = await usecase.execute({
      name: "Ecoponto Centro",
      materials: ["glass", "plastic"],
      street: "Rua A",
      number: "123",
      complement: "Ao lado da praça",
      postalCode: "63700-000",
      latitude: -5.179,
      longitude: -40.668,
      collectionDays: ["monday", "wednesday"],
      startTime: "08:00",
      endTime: "12:00",
      neighborhoodId: neighborhood.id,
      adminId: admin.id,
    });

    expect(output.id).toBeTruthy();

    const ecopointDb = await prisma.ecopoint.findUnique({
      where: { id: output.id },
    });

    expect(ecopointDb).not.toBeNull();
    expect(ecopointDb?.name).toBe("Ecoponto Centro");
    expect(ecopointDb?.neighborhood_id).toBe(neighborhood.id);

    // sem depender do formato exato no banco (string/csv)
    expect(ecopointDb?.accepted_materials).toContain("glass");
    expect(ecopointDb?.collection_days).toContain("monday");
    expect(ecopointDb?.collection_time).toContain("08:00");
  });
});
