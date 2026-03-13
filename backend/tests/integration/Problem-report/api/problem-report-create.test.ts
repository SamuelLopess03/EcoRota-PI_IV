import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";

describe("API: POST /problem-reports", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve criar um novo relato de problema", async () => {
    const admin = await prisma.administrador.create({
      data: { name: "Admin da Central", email: "admin.central@api.com", password: "password123" }
    });
    const route = await prisma.route.create({
      data: { name: "Rota Leste", collection_type: "Coleta regular", collection_days: "monday,thursday", collection_time: "08:00 - 09:30", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
      data: { name: "Bairro das Flores", latitude: -3.72, longitude: -38.54, cep: "60111-222", route_id: route.id, admin_id_created: admin.id }
    });
    const subscriber = await prisma.subscriber.create({
      data: { email: "cidadao.api@exemplo.com", street: "Rua das Rosas, 100", neighborhood_id: neighborhood.id }
    });

    const response = await request(app)
      .post("/problem-reports")
      .send({
        description: "Lixo acumulado na calçada há mais de uma semana",
        problemType: "Coleta não realizada",
        attachments: ["evidencia_lixo_1.jpg"],
        subscriberId: subscriber.id
      });

    expect(response.status).toBe(201);
    expect(response.body.protocol).toBeTruthy();
    expect(response.body.description).toBe("Lixo acumulado na calçada há mais de uma semana");
  }, 30000);

  it("deve retornar 404 se o assinante não existir", async () => {
    const response = await request(app)
      .post("/problem-reports")
      .send({
        description: "Uma descrição válida e suficientemente longa",
        problemType: "Coleta não realizada",
        attachments: [],
        subscriberId: 9999
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Assinante com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 400 se os dados forem inválidos (Zod)", async () => {
    const response = await request(app)
      .post("/problem-reports")
      .send({
        description: "Curta", 
        problemType: "Tipo Inexistente",
        subscriberId: "invalid-uuid-or-number"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Dados de entrada inválidos.");
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["description"], message: expect.any(String) }),
        expect.objectContaining({ path: ["subscriberId"], message: expect.any(String) })
      ])
    );
  }, 30000);
});
