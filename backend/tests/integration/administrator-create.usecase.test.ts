import { prisma } from "../../src/infrastructure/database/prismaClient.js";
import { PrismaAdministratorRepository } from "../../src/infrastructure/database/prisma/PrismaAdministratorRepository.js";
import { BCryptHashProvider } from "../../src/infrastructure/providers/BCryptHashProvider.js";
import { CreateAdministratorUseCase } from "../../src/application/use-cases/administrator/CreateAdministratorUseCase.js";
import { resetDatabase } from "../setup-db.js";

describe("Integration: CreateAdministratorUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it("deve criar administrador e persistir no banco", async () => {
    const repo = new PrismaAdministratorRepository(prisma);
    const hashProvider = new BCryptHashProvider();
    const usecase = new CreateAdministratorUseCase(repo, hashProvider);

    const output = await usecase.execute({
      name: "Admin Teste",
      email: "admin@teste.com",
      password: "123456",
    });

    expect(output.id).toBeTruthy();
    expect(output.email).toBe("admin@teste.com");

    const adminDb = await prisma.administrador.findUnique({
      where: { email: "admin@teste.com" },
    });

    expect(adminDb).not.toBeNull();
    expect(adminDb?.password).not.toBe("123456"); // tem que estar hasheada
  });

  it("não deve permitir e-mail duplicado (ConflictError)", async () => {
    const repo = new PrismaAdministratorRepository(prisma);
    const hashProvider = new BCryptHashProvider();
    const usecase = new CreateAdministratorUseCase(repo, hashProvider);

    await usecase.execute({
      name: "Admin 1",
      email: "dup@teste.com",
      password: "123456",
    });

    await expect(
      usecase.execute({
        name: "Admin 2",
        email: "dup@teste.com",
        password: "123456",
      })
    ).rejects.toBeTruthy();
  });
});
