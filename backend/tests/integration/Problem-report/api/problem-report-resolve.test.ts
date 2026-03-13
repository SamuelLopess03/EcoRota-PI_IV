import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import bcrypt from "bcrypt";

describe("API: PATCH /problem-reports/:id/resolve", () => {
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

  it("deve resolver um problema reportado", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota de Coleta Oeste", collection_type: "Coleta seletiva", collection_days: "wednesday,saturday", collection_time: "10:00 - 11:45", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Novo Horizonte", latitude: -3.75, longitude: -38.56, cep: "60500-100", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "cidadao.resolve@teste.com", street: "Avenida Central, 1200", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0100", description: "Lixeira comunitária quebrada e transbordando", problem_type: "Lixeira danificada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    const response = await request(app)
      .patch(`/problem-reports/${problem.id}/resolve`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "RESOLVED",
        justification: "A lixeira foi reparada e o local foi limpo pela equipe de manutenção."
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("RESOLVED");
  }, 30000);

  it("deve retornar 404 se o relato não existir", async () => {
    const response = await request(app)
      .patch("/problem-reports/9999/resolve")
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "RESOLVED",
        justification: "Uma justificativa válida e longa o suficiente para o teste."
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Relato de Problema com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 400 se o status for inválido", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota de Teste Erro", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro de Teste Erro", latitude: -3.7, longitude: -38.5, cep: "60000-000", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "erro.status@teste.com", street: "Rua do Erro", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0999", description: "Descrição do problema para teste de erro de status", problem_type: "Outros", status: "PENDING", url_attachments: "", subscriber_id: sub.id }
    });

    const response = await request(app)
      .patch(`/problem-reports/${problem.id}/resolve`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "INVALID_STATUS",
        justification: "Justificativa válida longa o suficiente"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("O status deve ser um dos seguintes");
  }, 30000);

  it("deve retornar 401 se não estiver autenticado", async () => {
    const response = await request(app)
      .patch("/problem-reports/1/resolve")
      .send({ 
        status: "RESOLVED",
        justification: "Justificativa válida longa o suficiente"
      });

    expect(response.status).toBe(401);
  }, 30000);
});
