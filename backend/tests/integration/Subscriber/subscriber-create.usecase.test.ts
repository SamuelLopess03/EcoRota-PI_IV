import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: RegisterSubscriberUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve criar um assinante vinculado a um bairro", async () => {
    // 🔹 admin (pré-requisito)
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
        name: "Rota Sul",
        collection_type: "CONVENCIONAL",
        collection_days: "TER,QUI",
        collection_time: "14:00",
        admin_id_created: admin.id,
        // se seu schema exigir admin_id_updated, set aqui também:
        // admin_id_updated: admin.id,
      },
    });

    // 🔹 bairro (pré-requisito)
    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro Novo",
        latitude: -5.17,
        longitude: -40.66,
        cep: "63700-111",
        route_id: route.id,
        admin_id_created: admin.id,
        // se seu schema exigir admin_id_updated, set aqui também:
        // admin_id_updated: admin.id,
      },
    });

    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const neighborhoodRepo = new PrismaNeighborhoodRepository(prisma);

    const usecase = new RegisterSubscriberUseCase(
      subscriberRepo,
      neighborhoodRepo
    );

    const output = await usecase.execute({
      email: "usuario@teste.com",
      street: "Rua A",
      neighborhoodId: neighborhood.id,
      number: "123",
      postalCode: "63700-111",
      // se o DTO exigir complement/latitude/longitude, adicione aqui
    });

    expect(output.id).toBeTruthy();

    const subscriberDb = await prisma.subscriber.findUnique({
      where: { id: output.id },
    });

    expect(subscriberDb).not.toBeNull();
    expect(subscriberDb?.email).toBe("usuario@teste.com");
    expect(subscriberDb?.neighborhood_id).toBe(neighborhood.id);
  }, 30000);
});
