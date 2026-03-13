import request from "supertest";
import { app } from "../../../../src/app.js";
import { prisma } from "../../../../src/infrastructure/database/prismaClient.js";
import { resetDatabase } from "../../../setup-db.js";

describe("API: GET /problem-reports", () => {
  beforeAll(async () => {
    await prisma.$connect();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  beforeEach(async () => {
    await resetDatabase();
  }, 30000);

  it("deve listar relatos de problemas", async () => {
    const admin = await prisma.administrador.create({
        data: { name: "Admin Listagem API", email: "admin.listapi@ecorota.com", password: "password123" }
    });
    const route = await prisma.route.create({
        data: { name: "Rota Tiradentes", collection_type: "Coleta regular", collection_days: "monday,friday", collection_time: "08:00 - 09:30", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Joaquim Távora", latitude: -3.74, longitude: -38.51, cep: "60115-000", route_id: route.id, admin_id_created: admin.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "usuario.listapi@teste.com", street: "Rua João Cordeiro, 500", neighborhood_id: neighborhood.id }
    });

    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0001", description: "Resíduos descartados incorretamente no canteiro central", problem_type: "Lixo espalhado", status: "PENDING", url_attachments: "", subscriber_id: sub.id }
    });

    const response = await request(app).get("/problem-reports");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].protocol).toBe("PR-2026-0001");
  }, 30000);

  it("deve filtrar por status", async () => {
     const admin = await prisma.administrador.create({
        data: { name: "Admin Filtro API", email: "admin.filtroapi@ecorota.com", password: "password123" }
    });
    const route = await prisma.route.create({
        data: { name: "Rota Sul II", collection_type: "Coleta regular", collection_days: "monday", collection_time: "08:00 - 09:00", admin_id_created: admin.id }
    });
    const neighborhood = await prisma.neighborhood.create({
        data: { name: "Bairro Castelão", latitude: -3.81, longitude: -38.52, cep: "60867-000", route_id: route.id, admin_id_created: admin.id }
    });
    const sub = await prisma.subscriber.create({
      data: { email: "usuario.filtroapi@teste.com", street: "Rua Alberto Craveiro, 100", neighborhood_id: neighborhood.id }
    });

    await prisma.reportedProblem.create({
      data: { protocol: "PR-2026-0002", description: "Problema com a frequência da coleta na avenida", problem_type: "Coleta não realizada", status: "RESOLVED", url_attachments: "", subscriber_id: sub.id }
    });

    const response = await request(app).get("/problem-reports?status=RESOLVED");

    expect(response.status).toBe(200);
    expect(response.body.every((r: any) => r.status === "RESOLVED")).toBe(true);
  }, 30000);
});
