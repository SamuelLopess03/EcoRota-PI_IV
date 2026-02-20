import { Administrator } from "../../../src/domain/entities/Administrator.js";
import { makeEmail, makeDates } from "../../helpers/factories.js";

describe("Entity: Administrator", () => {
  it("deve criar administrador com Email (VO)", () => {
    const dates = makeDates();
    const email = makeEmail("admin@ecorota.com");

    const admin = new Administrator(1, "Admin", email, "hashed", dates.createdAt, dates.updatedAt);

    expect(admin.name).toBe("Admin");
    expect(admin.email.getValue()).toBe("admin@ecorota.com");
  });
});
