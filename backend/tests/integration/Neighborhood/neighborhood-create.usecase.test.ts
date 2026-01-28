import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { PrismaRouteRepository } from "../../../src/infrastructure/database/prisma/PrismaRouteRepository.js";
import { CreateNeighborhoodUseCase } from "../../../src/application/use-cases/neighborhood/CreateNeighborhoodUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: CreateNeighborhoodUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it("deve criar um bairro e persistir no banco", async () => {
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
        name: "Rota Norte",
        collection_type: "Coleta regular",
        collection_days: "monday,wednesday,friday",
        collection_time: "14:00 - 15:00",
        admin_id_created: admin.id,
      },
    });

    const neighborhoodRepository = new PrismaNeighborhoodRepository(prisma);
    const routeRepository = new PrismaRouteRepository(prisma);

    const usecase = new CreateNeighborhoodUseCase(
      neighborhoodRepository,
      routeRepository
    );

   const output = await usecase.execute({
  name: "Centro",
  latitude: -5.178,
  longitude: -40.669,
  postalCode: "63700-000",
  populationEstimate: 12000,
  routeId: route.id,
  adminId: admin.id, 
});


    expect(output.id).toBeTruthy();

    const neighborhoodDb = await prisma.neighborhood.findUnique({
      where: { id: output.id },
    });

    expect(neighborhoodDb).not.toBeNull();
    expect(neighborhoodDb?.name).toBe("Centro");
  });
});
