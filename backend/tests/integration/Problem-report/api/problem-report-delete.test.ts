import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import bcrypt from "bcrypt";

describe("API: DELETE /problem-reports/:id", () => {
  let token: string;

  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
    const hashedPassword = await bcrypt.hash("admin", 10);
    await prisma.administrador.create({
      data: { name: "Admin", email: "admin@ecorota.com", password: hashedPassword }
    });

    const loginRes = await request(app).post("/auth/login").send({
        email: "admin@ecorota.com",
        password: "admin"
    });
    token = loginRes.body.token;
  }, 30000);

  it("deve deletar um relato de problema", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota de Coleta Norte", collection_type: "Coleta regular", collection_days: "tuesday,friday", collection_time: "07:00 - 08:30", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro de Santo Antônio", latitude: -3.73, longitude: -38.53, cep: "60300-400", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "cidadao.delecao@ecorota.com", street: "Rua do Rosário, 350", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0001", description: "Vazamento de esgoto na calçada do vizinho", problem_type: "Outros", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    const response = await request(app)
      .delete(`/problem-reports/${problem.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const db = await prisma.reportedProblem.findUnique({ where: { id: problem.id } });
    expect(db).toBeNull();
  }, 30000);

  it("deve retornar 404 ao deletar um relato inexistente", async () => {
    const response = await request(app)
      .delete("/problem-reports/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Relato de Problema com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 401 se não estiver autenticado", async () => {
    const response = await request(app)
      .delete("/problem-reports/1");

    expect(response.status).toBe(401);
  }, 30000);
});
