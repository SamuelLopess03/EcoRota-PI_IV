import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import { JwtTokenProvider } from "../../../../src/infrastructure/providers/JwtTokenProvider.js";

describe("API: Subscriber - Delete (DELETE /subscribers/:id)", () => {
  let adminId: number;
  let adminToken: string;
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

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: "Bairro de Teste",
        latitude: -5.0,
        longitude: -42.0,
        cep: "63700-000",
        route_id: route.id,
        admin_id_created: adminId,
      },
    });
    neighborhoodId = neighborhood.id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve remover um assinante com sucesso (204)", async () => {
    const subscriber = await prisma.subscriber.create({
      data: { email: "deletar@teste.com", street: "Rua", neighborhood_id: neighborhoodId }
    });

    const response = await request(app)
      .delete(`/subscribers/${subscriber.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    const deletedInDb = await prisma.subscriber.findUnique({ where: { id: subscriber.id } });
    expect(deletedInDb).toBeNull();
  });

  it("deve retornar 401 se não estiver autenticado", async () => {
    const response = await request(app)
      .delete("/subscribers/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token ausente");
  });

  it("deve retornar 404 se o assinante não existir", async () => {
    const response = await request(app)
      .delete("/subscribers/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Assinante com identificador '9999' não foi encontrado.");
  });
});
