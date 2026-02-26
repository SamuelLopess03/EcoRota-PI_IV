import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import { JwtTokenProvider } from "../../../../src/infrastructure/providers/JwtTokenProvider.js";

describe("API: Subscriber - Update (PUT /subscribers/:id)", () => {
  let adminId: number;
  let adminToken: string;
  let routeId: number;
  let neighborhoodId: number;
  const tokenProvider = new JwtTokenProvider();

  beforeEach(async () => {
    await resetDatabase();
    
    const admin = await prisma.administrador.create({
      data: { name: "Admin Test", email: "admin@test.com", password: "hash" }
    });
    adminId = admin.id;

    adminToken = tokenProvider.generate({ sub: adminId, email: admin.email });

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
    neighborhoodId = neighborhood.id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it("deve atualizar dados do assinante com sucesso (200)", async () => {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: "original@teste.com",
        street: "Antiga Rua",
        number: "10",
        neighborhood_id: neighborhoodId,
      }
    });

    const response = await request(app)
      .put(`/subscribers/${subscriber.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        street: "Nova Rua",
        number: "20"
      });

    expect(response.status).toBe(200);
    expect(response.body.street).toBe("Nova Rua");
    expect(response.body.number).toBe("20");

    const updatedDb = await prisma.subscriber.findUnique({ where: { id: subscriber.id } });
    expect(updatedDb?.street).toBe("Nova Rua");
  }, 30000);

  it("deve retornar 401 se o token estiver ausente", async () => {
    const response = await request(app)
      .put("/subscribers/1")
      .send({ street: "Tenta sem token" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token ausente");
  }, 30000);

  it("deve retornar 404 se o assinante não existir", async () => {
    const response = await request(app)
      .put("/subscribers/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ street: "Alguma Rua" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Assinante com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 409 se tentar atualizar para um e-mail já em uso", async () => {
    await prisma.subscriber.create({
      data: { email: "outro@teste.com", street: "Rua X", neighborhood_id: neighborhoodId }
    });

    const subscriber = await prisma.subscriber.create({
      data: { email: "meu@teste.com", street: "Rua Y", neighborhood_id: neighborhoodId }
    });

    const response = await request(app)
      .put(`/subscribers/${subscriber.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "outro@teste.com" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Já existe um assinante com este e-mail.");
  }, 30000);
});
