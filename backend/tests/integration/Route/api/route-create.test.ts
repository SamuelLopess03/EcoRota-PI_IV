import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import { JwtTokenProvider } from "../../../../src/infrastructure/providers/JwtTokenProvider.js";

describe("API: Route - Create (POST /routes)", () => {
  let adminId: number;
  let adminToken: string;
  const tokenProvider = new JwtTokenProvider();

  beforeEach(async () => {
    await resetDatabase();
    
    const admin = await prisma.administrador.create({
      data: { name: "Admin Test", email: "admin@test.com", password: "hash" }
    });
    adminId = admin.id;
    adminToken = tokenProvider.generate({ sub: adminId, email: admin.email });
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it("deve criar uma nova rota com sucesso (201)", async () => {
    const payload = {
      name: "Rota Norte",
      collectionType: "Coleta seletiva",
      collectionDays: ["monday", "wednesday", "friday"],
      startTime: "08:00",
      endTime: "10:00"
    };

    const response = await request(app)
      .post("/routes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(payload.name);
    expect(response.body.collectionType).toBe(payload.collectionType);

    const routeInDb = await prisma.route.findFirst({
      where: { name: payload.name }
    });
    expect(routeInDb).not.toBeNull();
    expect(routeInDb?.admin_id_created).toBe(adminId);
  }, 30000);

  it("deve retornar 409 se o nome da rota já existir", async () => {
    await prisma.route.create({
      data: {
        name: "Rota Existente",
        collection_type: "REGULAR",
        collection_days: "monday",
        collection_time: "08:00 - 10:00",
        admin_id_created: adminId,
      },
    });

    const payload = {
      name: "Rota Existente",
      collectionType: "Coleta seletiva",
      collectionDays: ["friday"],
      startTime: "08:00",
      endTime: "10:00"
    };

    const response = await request(app)
      .post("/routes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Rota com nome 'Rota Existente' já existe.");
  }, 30000);

  it("deve retornar 401 se o token estiver ausente", async () => {
    const payload = {
      name: "Rota Sem Auth",
      collectionType: "REGULAR",
      collectionDays: ["monday"],
      startTime: "08:00",
      endTime: "10:00"
    };

    const response = await request(app)
      .post("/routes")
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token ausente");
  }, 30000);

  it("deve retornar 400 para dados inválidos (Zod Validation)", async () => {
    const payload = {
      name: "Ro", // Curto demais
      collectionType: "Coleta",
      collectionDays: [], // Deve ter ao menos 1
      startTime: "8:00", // Formato errado (HH:mm)
      endTime: "10:00"
    };

    const response = await request(app)
      .post("/routes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Dados de entrada inválidos.");
    expect(response.body).toHaveProperty("details");
  }, 30000);
});
