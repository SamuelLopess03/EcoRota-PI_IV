import { prisma } from "../../../src/infrastructure/database/prismaClient.js";
import { PrismaSubscriberRepository } from "../../../src/infrastructure/database/prisma/PrismaSubscriberRepository.js";
import { PrismaNeighborhoodRepository } from "../../../src/infrastructure/database/prisma/PrismaNeighborhoodRepository.js";
import { RegisterSubscriberUseCase } from "../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { UpdateSubscriberProfileUseCase } from "../../../src/application/use-cases/subscriber/UpdateSubscriberProfileUseCase.js";
import { resetDatabase } from "../../setup-db.js";
import { ConflictError } from "../../../src/domain/errors/persistence/ConflictError.js";
import { EntityNotFoundError } from "../../../src/domain/errors/persistence/EntityNotFoundError.js";

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

  it("deve lançar EntityNotFoundError ao atualizar assinante inexistente", async () => {
    const repo = new PrismaSubscriberRepository(prisma);
    const nRepo = new PrismaNeighborhoodRepository(prisma);
    const usecase = new UpdateSubscriberProfileUseCase(repo, nRepo);

    const promise = usecase.execute(9999, { street: "Nova Rua" });
    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow("Assinante com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve lançar ConflictError ao tentar atualizar e-mail para um já em uso", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin", email: "admin@test.com", password: "pwd" },
    });

    const route = await prisma.route.create({
      data: {
        name: "Route",
        collection_type: "CONVENCIONAL",
        collection_days: "SEG",
        collection_time: "10:00",
        admin_id_created: admin.id,
      },
    });

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "NH",
        latitude: 0,
        longitude: 0,
        cep: "00000-000",
        route_id: route.id,
        admin_id_created: admin.id,
      },
    });

    const repo = new PrismaSubscriberRepository(prisma);
    const nRepo = new PrismaNeighborhoodRepository(prisma);
    const register = new RegisterSubscriberUseCase(repo, nRepo);

    const s1 = await register.execute({
      email: "user1@test.com",
      street: "R1",
      neighborhoodId: neighborhood.id,
      number: "1",
    });
    const s2 = await register.execute({
      email: "user2@test.com",
      street: "R2",
      neighborhoodId: neighborhood.id,
      number: "2",
    });

    const update = new UpdateSubscriberProfileUseCase(repo, nRepo);
    const promise = update.execute(s1.id, { email: "user2@test.com" });
    await expect(promise).rejects.toThrow(ConflictError);
    await expect(promise).rejects.toThrow("Já existe um assinante com este e-mail.");
  }, 30000);

  it("deve lançar EntityNotFoundError se o novo bairro informado não existir", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "A", email: "a@a.com", password: "p" },
    });

    const route = await prisma.route.create({
      data: {
        name: "R",
        collection_type: "CONVENCIONAL",
        collection_days: "S",
        collection_time: "H",
        admin_id_created: admin.id,
      },
    });

    const nh = await prisma.neighborhood.create({
      data: { name: "N", latitude: 0, longitude: 0, cep: "63700-000", route_id: route.id, admin_id_created: admin.id },
    });

    const repo = new PrismaSubscriberRepository(prisma);
    const nRepo = new PrismaNeighborhoodRepository(prisma);
    const register = new RegisterSubscriberUseCase(repo, nRepo);
    const s = await register.execute({ email: "s@s.com", street: "r", neighborhoodId: nh.id, number: "1" });

    const update = new UpdateSubscriberProfileUseCase(repo, nRepo);
    const promise = update.execute(s.id, { neighborhoodId: 99999 });
    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow("Bairro com identificador '99999' não foi encontrado.");
  }, 30000);
});
