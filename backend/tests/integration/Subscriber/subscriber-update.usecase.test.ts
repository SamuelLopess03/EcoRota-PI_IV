import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { UpdateSubscriberProfileUseCase } from "../../../src/application/use-cases/subscriber/UpdateSubscriberProfileUseCase.js";
import { resetDatabase } from "../../setup-db.js";

describe("Integration: UpdateSubscriberProfileUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve atualizar o perfil do assinante e persistir no banco", async () => {
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
      },
    });

    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const neighborhoodRepo = new PrismaNeighborhoodRepository(prisma);

    // 🔹 cria primeiro
    const registerUsecase = new RegisterSubscriberUseCase(
      subscriberRepo,
      neighborhoodRepo
    );

    const created = await registerUsecase.execute({
      email: "usuario@teste.com",
      street: "Rua A",
      neighborhoodId: neighborhood.id,
      number: "123",
      postalCode: "63700-111",
    });

    // ✅ AGORA SIM: execute(id, dto)
    const updateUsecase = new UpdateSubscriberProfileUseCase(
      subscriberRepo,
      neighborhoodRepo
    );

    const updated = await updateUsecase.execute(created.id, {
      email: "JeffersonLima@teste.com",
      street: "Rua Xesquedele",
      number: "456",
      complement: "AP 101",
      postalCode: "63700222",
      latitude: -5.171,
      longitude: -40.661,
    });

    expect(updated.id).toBe(created.id);
    expect(updated.email).toBe("jeffersonlima@teste.com");

    const subscriberDb = await prisma.subscriber.findUnique({
      where: { id: created.id },
    });

    expect(subscriberDb).not.toBeNull();
    expect(subscriberDb?.email).toBe("jeffersonlima@teste.com");
    expect(subscriberDb?.street).toBe("Rua Xesquedele");
    expect(subscriberDb?.number).toBe("456");
    expect(subscriberDb?.complement).toBe("AP 101");
    expect(subscriberDb?.postal_code).toBe("63700222");
  }, 30000);
});
