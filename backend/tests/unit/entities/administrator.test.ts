import { Administrator } from "../../../src/domain/entities/Administrator.js";
import { makeEmail, makeDates } from "../../helpers/valueObjectFactories.js";

describe("Entity: Administrator", () => {
  it("deve criar administrador com email válido", () => {
    const dates = makeDates();
    const email = makeEmail("admin@ecorota.com");

    const admin = new Administrator(1, "Admin", email, "hashed", dates.createdAt, dates.updatedAt);

    expect(admin.id).toBe(1);
    expect(admin.name).toBe("Admin");
    expect(admin.email.getValue()).toBe("admin@ecorota.com");
    expect(admin.password).toBe("hashed");
    expect(admin.createdAt).toBe(dates.createdAt);
    expect(admin.updatedAt).toBe(dates.updatedAt);
  });
});
