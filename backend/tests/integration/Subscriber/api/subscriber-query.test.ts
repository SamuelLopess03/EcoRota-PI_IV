import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";

describe("API: Subscriber - Query (GET)", () => {
  let adminId: number;
  let routeId: number;
  let neighborhoodAId: number;
  let neighborhoodBId: number;

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

    const nA = await prisma.neighborhood.create({
      data: { name: "Bairro A", latitude: -5.0, longitude: -42.0, cep: "63700000", route_id: routeId, admin_id_created: adminId }
    });
    neighborhoodAId = nA.id;

    const nB = await prisma.neighborhood.create({
      data: { name: "Bairro B", latitude: -5.1, longitude: -42.1, cep: "63700111", route_id: routeId, admin_id_created: adminId }
    });
    neighborhoodBId = nB.id;

    await prisma.subscriber.createMany({
      data: [
        { email: "user1@a.com", street: "Rua A1", neighborhood_id: neighborhoodAId },
        { email: "user2@a.com", street: "Rua A2", neighborhood_id: neighborhoodAId },
        { email: "user3@b.com", street: "Rua B1", neighborhood_id: neighborhoodBId },
      ]
    });
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  describe("GET /subscribers", () => {
    it("deve listar todos os assinantes (200)", async () => {
      const response = await request(app).get("/subscribers");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty("email");
    }, 30000);

    it("deve filtrar assinantes por bairro (200)", async () => {
      const response = await request(app).get(`/subscribers?neighborhoodId=${neighborhoodAId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.every((s: any) => s.neighborhoodId === neighborhoodAId)).toBe(true);
    }, 30000);

    it("deve retornar lista vazia se o bairro não tiver assinantes", async () => {
        const emptyNH = await prisma.neighborhood.create({
          data: { name: "Empty", latitude: 0, longitude: 0, cep: "00000000", route_id: routeId, admin_id_created: adminId }
        });

        const response = await request(app).get(`/subscribers?neighborhoodId=${emptyNH.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    }, 30000);
  });

  describe("GET /subscribers/:id", () => {
    it("deve buscar um assinante por ID (200)", async () => {
      const subscriber = await prisma.subscriber.findFirst({ where: { email: "user1@a.com" } });

      const response = await request(app).get(`/subscribers/${subscriber!.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(subscriber!.id);
      expect(response.body.email).toBe("user1@a.com");
    }, 30000);

    it("deve retornar 404 se o assinante não existir", async () => {
      const response = await request(app).get("/subscribers/9999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Assinante com identificador '9999' não foi encontrado.");
    }, 30000);
  });

  describe("GET /subscribers/identify", () => {
    it("deve identificar um assinante pelo e-mail (200)", async () => {
      const response = await request(app)
        .get("/subscribers/identify")
        .query({ email: "user3@b.com" });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("user3@b.com");
    }, 30000);

    it("deve retornar 404 se o e-mail não for encontrado na identificação", async () => {
      const response = await request(app)
        .get("/subscribers/identify")
        .query({ email: "naoexiste@teste.com" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Assinante com identificador 'naoexiste@teste.com' não foi encontrado.");
    }, 30000);

    it("deve retornar 400 se o e-mail não for informado na identificação", async () => {
        const response = await request(app).get("/subscribers/identify");
  
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("E-mail é obrigatório.");
    }, 30000);
  });
});
