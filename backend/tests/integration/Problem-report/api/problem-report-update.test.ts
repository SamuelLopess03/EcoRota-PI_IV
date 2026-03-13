import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";
import bcrypt from "bcrypt";

describe("API: PUT /problem-reports/:id", () => {
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

  it("deve atualizar um relato de problema", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota Noroeste", collection_type: "Coleta regular", collection_days: "monday,wednesday", collection_time: "09:00 - 10:30", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro do Sol", latitude: -3.78, longitude: -38.58, cep: "60800-200", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "cidadao.update@teste.com", street: "Rua do Amanhecer, 45", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0200", description: "Lixo acumulado impedindo a passagem na calçada", problem_type: "Coleta não realizada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    const response = await request(app)
      .put(`/problem-reports/${problem.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Lixo acumulado e com mau cheiro forte há dias",
        problemType: "Coleta não realizada",
        subscriberId: sub.id
      });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Lixo acumulado e com mau cheiro forte há dias");
  }, 30000);

  it("deve retornar 404 se o relato não existir", async () => {
    const response = await request(app)
      .put("/problem-reports/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Nova descrição válida e suficientemente longa",
        problemType: "Outros"
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Relato de Problema com identificador '9999' não foi encontrado.");
  }, 30000);

  it("deve retornar 404 se o novo assinante não existir", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota Teste Sub", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Teste Sub", latitude: -3.7, longitude: -38.5, cep: "60000-000", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "sub.origem@teste.com", street: "Rua de Origem", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0201", description: "Descrição vailda longa o suficiente", problem_type: "Coleta não realizada", status: "PENDING", url_attachments: "[]", subscriber_id: sub.id }
    });

    const response = await request(app)
      .put(`/problem-reports/${problem.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        subscriberId: 8888
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Assinante com identificador '8888' não foi encontrado.");
  }, 30000);

  it("deve retornar 400 se os dados forem inválidos (Zod)", async () => {
    const admin = await prisma.administrador.findFirst({ where: { email: "admin@ecorota.com" } });
    const route = await prisma.route.create({
        data: { name: "Rota Teste Zod", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin!.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Teste Zod", latitude: -3.7, longitude: -38.5, cep: "60000-000", route_id: route.id, admin_id_created: admin!.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "zod.update@teste.com", street: "Rua do Zod", neighborhood_id: neighborhood.id }
    });
    const problem = await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0900", description: "Descrição válida para teste de erro de Zod", problem_type: "Outros", status: "PENDING", url_attachments: "", subscriber_id: sub.id }
    });

    const response = await request(app)
      .put(`/problem-reports/${problem.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Curta",
        problemType: "X",
        subscriberId: -1
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Dados de entrada inválidos.");
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["description"], message: expect.any(String) }),
        expect.objectContaining({ path: ["problemType"], message: expect.any(String) }),
        expect.objectContaining({ path: ["subscriberId"], message: expect.any(String) })
      ])
    );
  }, 30000);
});
