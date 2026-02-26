import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { PrismaRouteRepository } from "../../../../src/infrastructure/database/prisma/PrismaRouteRepository.js";
import { CreateRouteUseCase } from "../../../../src/application/use-cases/route/CreateRouteUseCase.js";
import { DeleteRouteUseCase } from "../../../../src/application/use-cases/route/DeleteRouteUseCase.js";
import { resetDatabase } from "../../../setup-db.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { DependencyError } from "../../../../src/domain/errors/persistence/DependencyError.js";

describe("Integration: DeleteRouteUseCase + Prisma (DB real)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve deletar uma rota (sem bairros vinculados) e remover do banco", async () => {
    const admin = await prisma.administrador.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: "hash",
      },
    });

    const routeRepository = new PrismaRouteRepository(prisma);
    const createUseCase = new CreateRouteUseCase(routeRepository);

    const created = await createUseCase.execute({
      name: "Rota Sem Bairros",
      collectionType: "Coleta regular",
      collectionDays: ["monday"],
      startTime: "10:00",
      endTime: "11:00",
      adminId: admin.id,
    });

    const deleteUseCase = new DeleteRouteUseCase(routeRepository);

    await deleteUseCase.execute(created.id);

    const routeDb = await prisma.route.findUnique({
      where: { id: created.id },
    });

    expect(routeDb).toBeNull();
  }, 30000);

  it("deve lançar EntityNotFoundError ao excluir rota inexistente", async () => {
    const routeRepository = new PrismaRouteRepository(prisma);
    const deleteUseCase = new DeleteRouteUseCase(routeRepository);

    const promise = deleteUseCase.execute(9999);

    await expect(promise).rejects.toThrow(EntityNotFoundError);
    await expect(promise).rejects.toThrow("Rota com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve lançar DependencyError ao excluir rota com bairros vinculados", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin", email: "admin@dep.com", password: "hash" },
    });

    const route = await prisma.route.create({
      data: {
        name: "Rota com Bairro",
        collection_type: "Coleta regular",
        collection_days: "monday",
        collection_time: "08:00 - 10:00",
        admin_id_created: admin.id,
      },
    });

    await prisma.neighborhood.create({
      data: {
        name: "Bairro de Teste",
        latitude: 0,
        longitude: 0,
        cep: "12345678",
        route_id: route.id,
        admin_id_created: admin.id,
      },
    });

    const routeRepository = new PrismaRouteRepository(prisma);
    const deleteUseCase = new DeleteRouteUseCase(routeRepository);

    const promise = deleteUseCase.execute(route.id);

    await expect(promise).rejects.toThrow(DependencyError);
    await expect(promise).rejects.toThrow(
      "Não é possível excluir esta rota pois existem bairros vinculados a ela."
    );
  }, 30000);
});
