import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";

describe("API: Subscriber - Create (POST /subscribers)", () => {
  let adminId: number;
  let routeId: number;

  beforeEach(async () => {
    await resetDatabase();
    
    const admin = await prisma.administrador.create({
      data: { name: "Admin Test", email: "admin@test.com", password: "hash" }
    });
    adminId = admin.id;

    const route = await prisma.route.create({
      data: {
        name: "Route Test",
        collection_type: "CONVENCIONAL",
        collection_days: "SEG",
        collection_time: "08:00",
        admin_id_created: adminId
      }
    });
    routeId = route.id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it("deve cadastrar um novo assinante com sucesso (201)", async () => {
    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro de Teste",
        latitude: -5.0,
        longitude: -42.0,
        cep: "63700-000",
        route_id: routeId,
        admin_id_created: adminId,
      },
    });

    const payload = {
      email: "novo@assinante.com",
      street: "Rua de Teste",
      number: "123",
      neighborhoodId: neighborhood.id,
      postalCode: "63700000",
      latitude: -5.123,
      longitude: -42.123,
    };

    const response = await request(app)
      .post("/subscribers")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(payload.email);
    expect(response.body.neighborhoodId).toBe(neighborhood.id);

    const subscriberInDb = await prisma.subscriber.findUnique({
      where: { email: payload.email }
    });
    expect(subscriberInDb).not.toBeNull();
  }, 30000);

  it("deve retornar 409 se o e-mail já estiver cadastrado", async () => {
    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro A",
        latitude: 0,
        longitude: 0,
        cep: "00000000",
        route_id: routeId,
        admin_id_created: adminId,
      },
    });

    await prisma.subscriber.create({
      data: {
        email: "repetido@teste.com",
        street: "Rua A",
        number: "1",
        neighborhood_id: neighborhood.id,
        postal_code: "63700000",
      },
    });

    const payload = {
      email: "repetido@teste.com",
      street: "Rua B",
      number: "2",
      neighborhoodId: neighborhood.id,
    };

    const response = await request(app)
      .post("/subscribers")
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(`Assinante com e-mail 'repetido@teste.com' já existe.`);
  }, 30000);

  it("deve retornar 404 se o bairro não existir", async () => {
    const payload = {
      email: "alone@teste.com",
      street: "Rua Sem Bairro",
      number: "0",
      neighborhoodId: 404,
    };

    const response = await request(app)
      .post("/subscribers")
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Bairro com identificador '404' não foi encontrado.");
  }, 30000);

  it("deve retornar 400 para dados inválidos (Zod Validation)", async () => {
    const payload = {
        street: "Ru", // Inválido (min 3)
        // email faltando
        // neighborhoodId faltando
    };

    const response = await request(app)
      .post("/subscribers")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Dados de entrada inválidos.");
    expect(response.body).toHaveProperty("details");
  }, 30000);
});
