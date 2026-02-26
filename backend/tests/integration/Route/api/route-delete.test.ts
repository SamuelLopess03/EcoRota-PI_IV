import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import { JwtTokenProvider } from "../../../../src/infrastructure/providers/JwtTokenProvider.js";

describe("API: Route - Delete (DELETE /routes/:id)", () => {
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
        name: "Rota Para Deletar",
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

  it("deve deletar uma rota com sucesso (204)", async () => {
    const response = await request(app)
      .delete(`/routes/${routeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    const routeDb = await prisma.route.findUnique({ where: { id: routeId } });
    expect(routeDb).toBeNull();
  }, 30000);

  it("deve retornar 404 se a rota não existir", async () => {
    const response = await request(app)
      .delete("/routes/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Rota com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 400 (DependencyError) se a rota tiver bairros vinculados", async () => {
    await prisma.neighborhood.create({
      data: {
        name: "Bairro Vinculado",
        latitude: 0,
        longitude: 0,
        cep: "12345678",
        route_id: routeId,
        admin_id_created: adminId,
      },
    });

    const response = await request(app)
      .delete(`/routes/${routeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(409); 
    expect(response.body.error).toBe("Não é possível excluir esta rota pois existem bairros vinculados a ela.");
  }, 30000);

  it("deve retornar 401 se o token estiver ausente", async () => {
    const response = await request(app)
      .delete(`/routes/${routeId}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token ausente");
  }, 30000);
});
