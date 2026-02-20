import { Subscriber } from "../../../src/domain/entities/Subscriber.js";
import { makeEmail, makeAddress, makeDates } from "../../helpers/factories.js";

describe("Entity: Subscriber", () => {
  it("deve criar subscriber com email e address (VO)", () => {
    const dates = makeDates();
    const email = makeEmail("user@ecorota.com");
    const address = makeAddress();

    const sub = new Subscriber(1, email, address, 123, dates.createdAt, dates.updatedAt);

    expect(sub.id).toBe(1);
    expect(sub.email.getValue()).toBe("user@ecorota.com");
    expect(sub.neighborhoodId).toBe(123);
  });
});
