import { Administrator } from "../../../src/domain/entities/Administrator.js";
import { makeEmail, makeDates } from "../../helpers/factories.js";

describe("Entity: Administrator", () => {
  it("deve criar administrador com Email (VO)", () => {
    console.log("\n==============================");
    console.log("[Administrator] Iniciando teste");
    console.log("==============================");

    const dates = makeDates();
    const email = makeEmail("admin@ecorota.com");

    const admin = new Administrator(1, "Admin", email, "hashed", dates.createdAt, dates.updatedAt);

    console.log("[Administrator] Administrator criado:", admin);

    expect(admin.name).toBe("Admin");
    expect(admin.email.getValue()).toBe("admin@ecorota.com");

    console.log("[Administrator] ✅ OK");
  });
});
