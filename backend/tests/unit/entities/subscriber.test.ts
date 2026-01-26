import { Subscriber } from "../../../src/domain/entities/Subscriber.js";
import { makeEmail, makeAddress, makeDates } from "../../helpers/factories.js";

describe("Entity: Subscriber", () => {
  it("deve criar subscriber com email e address (VO)", () => {
    console.log("\n==============================");
    console.log("[Subscriber] Iniciando teste");
    console.log("==============================");

    const dates = makeDates();
    console.log("[Subscriber] Datas:");
    console.log("  createdAt =", dates.createdAt.toISOString());
    console.log("  updatedAt =", dates.updatedAt.toISOString());

    const email = makeEmail("user@ecorota.com");
    console.log("[Subscriber] Email:");
    console.log("  email =", email.getValue());

    const address = makeAddress();
    console.log("[Subscriber] Address (obj):", address);

    const sub = new Subscriber(1, email, address, 123, dates.createdAt, dates.updatedAt);

    console.log("[Subscriber] Subscriber criado:");
    console.log("  id =", sub.id);
    console.log("  neighborhoodId =", sub.neighborhoodId);

    expect(sub.id).toBe(1);
    expect(sub.email.getValue()).toBe("user@ecorota.com");
    expect(sub.neighborhoodId).toBe(123);

    console.log("[Subscriber] ✅ OK");
  });
});
