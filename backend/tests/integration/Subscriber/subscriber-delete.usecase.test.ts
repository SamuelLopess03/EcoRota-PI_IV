import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { UnsubscribeUseCase } from "../../../src/application/use-cases/subscriber/UnsubscribeUseCase.js";
import { resetDatabase } from "../../setup-db.js";
import { EntityNotFoundError } from "../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("Integration: UnsubscribeUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve deletar um assinante (unsubscribe) e remover do banco", async () => {
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    const route = await prisma.route.create({
      data: {
        name: "Rota Sul",
        collection_type: "CONVENCIONAL",
        collection_days: "TER,QUI",
        collection_time: "14:00",
        admin_id_created: admin.id,
      },
    });

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

    const unsubscribeUsecase = new UnsubscribeUseCase(subscriberRepo);
    await unsubscribeUsecase.execute(created.id);

    const subscriberDb = await prisma.subscriber.findUnique({
      where: { id: created.id },
    });

    expect(subscriberDb).toBeNull();
  }, 30000);

  it("deve lançar EntityNotFoundError ao remover assinante inexistente", async () => {
    const subscriberRepo = new PrismaSubscriberRepository(prisma);
    const usecase = new UnsubscribeUseCase(subscriberRepo);

    const promise = usecase.execute(9999);
    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow("Assinante com identificador '9999' não foi encontrado.");
  }, 30000);
});
