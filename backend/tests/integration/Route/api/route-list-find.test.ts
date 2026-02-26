import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";

describe("API: Route - List and Find (GET /routes)", () => {
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
        name: "Rota de Teste",
        collection_type: "Coleta regular",
        collection_days: "monday,wednesday,friday",
        collection_time: "08:00 - 10:00",
        admin_id_created: adminId,
      },
    });
    routeId = route.id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it("deve listar todas as rotas (200)", async () => {
    const response = await request(app).get("/routes");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body.some((r: any) => r.name === "Rota de Teste")).toBe(true);
  }, 30000);

  it("deve buscar uma rota por ID (200)", async () => {
    const response = await request(app).get(`/routes/${routeId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(routeId);
    expect(response.body.name).toBe("Rota de Teste");
    expect(response.body.collectionDays).toEqual(["monday", "wednesday", "friday"]);
  }, 30000);

  it("deve retornar 404 se a rota não existir", async () => {
    const response = await request(app).get("/routes/9999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Rota com identificador '9999' não foi encontrado.");
  }, 30000);
});
