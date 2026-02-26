import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import { JwtTokenProvider } from "../../../../src/infrastructure/providers/JwtTokenProvider.js";

describe("API: Route - Update (PUT /routes/:id)", () => {
  let adminId: number;
  let adminToken: string;
  let routeId: number;
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
        name: "Rota Original",
        collection_type: "Coleta regular",
        collection_days: "monday",
        collection_time: "08:00 - 10:00",
        admin_id_created: adminId,
      },
    });
    routeId = route.id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it("deve atualizar uma rota com sucesso (200)", async () => {
    const payload = {
      name: "Rota Alterada",
      collectionType: "Coleta seletiva",
      collectionDays: ["tuesday"],
      startTime: "13:00",
      endTime: "15:00"
    };

    const response = await request(app)
      .put(`/routes/${routeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(payload.name);
    expect(response.body.adminIdUpdated).toBe(adminId);

    const routeInDb = await prisma.route.findUnique({ where: { id: routeId } });
    expect(routeInDb?.name).toBe(payload.name);
    expect(routeInDb?.admin_id_updated).toBe(adminId);
  }, 30000);

  it("deve retornar 404 se a rota não existir", async () => {
    const response = await request(app)
      .put("/routes/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Inexistente" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Rota com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 409 se tentar mudar para um nome já existente", async () => {
    await prisma.route.create({
      data: {
        name: "Outra Rota",
        collection_type: "Coleta regular",
        collection_days: "monday",
        collection_time: "08:00 - 10:00",
        admin_id_created: adminId,
      },
    });

    const response = await request(app)
      .put(`/routes/${routeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Outra Rota" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Já existe uma rota com este nome.");
  }, 30000);

  it("deve retornar 401 se o token estiver ausente", async () => {
    const response = await request(app)
      .put(`/routes/${routeId}`)
      .send({ name: "Sem Token" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token ausente");
  }, 30000);
});
