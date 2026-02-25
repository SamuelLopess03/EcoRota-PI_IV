import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaSubscriberRepository } from "../../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { resetDatabase } from "../../../setup-db.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

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
    });

    expect(output.id).toBeTruthy();

    const subscriberDb = await prisma.subscriber.findUnique({
      where: { id: output.id },
    });

    expect(subscriberDb).not.toBeNull();
    expect(subscriberDb?.email).toBe("usuario@teste.com");
    expect(subscriberDb?.neighborhood_id).toBe(neighborhood.id);
  }, 30000);

  it("não deve permitir cadastrar assinante com e-mail duplicado (ConflictError)", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin", email: "admin@err.com", password: "hash" },
    });

    const route = await prisma.route.create({
      data: {
        name: "Rota Err",
        collection_type: "CONVENCIONAL",
        collection_days: "SEG",
        collection_time: "10:00",
        admin_id_created: admin.id,
      },
    });

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro Err",
        latitude: 0,
        longitude: 0,
        cep: "00000-000",
        route_id: route.id,
        admin_id_created: admin.id,
      },
    });

    const repo = new PrismaSubscriberRepository(prisma);
    const nRepo = new PrismaNeighborhoodRepository(prisma);
    const usecase = new RegisterSubscriberUseCase(repo, nRepo);

    await usecase.execute({
      email: "duplicate@teste.com",
      street: "Rua 1",
      neighborhoodId: neighborhood.id,
      number: "1",
      postalCode: "63700-111",
    });

    const promise = usecase.execute({
        email: "duplicate@teste.com",
        street: "Rua 2",
        neighborhoodId: neighborhood.id,
        number: "2",
        postalCode: "63700-111",
      });
    await expect(promise).rejects.toThrow(ConflictError);
    await expect(promise).rejects.toThrow("Assinante com e-mail 'duplicate@teste.com' já existe.");
  }, 30000);

  it("deve lançar EntityNotFoundError se o bairro não existir", async () => {
    const repo = new PrismaSubscriberRepository(prisma);
    const nRepo = new PrismaNeighborhoodRepository(prisma);
    const usecase = new RegisterSubscriberUseCase(repo, nRepo);

    const promise = usecase.execute({
        email: "alone@teste.com",
        street: "Rua Sem Bairro",
        neighborhoodId: 9999,
        number: "0",
        postalCode: "63700-111",
      });
    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow("Bairro com identificador '9999' não foi encontrado.");
  }, 30000);
});
