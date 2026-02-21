import { Subscriber } from "../../../src/domain/entities/Subscriber.js";
import { makeEmail, makeAddress, makeDates } from "../../helpers/valueObjectFactories.js";

describe("Entity: Subscriber", () => {
  it("deve criar subscriber com email e address válidos", () => {
    const dates = makeDates();
    const email = makeEmail("user@ecorota.com");
    const address = makeAddress();

    const sub = new Subscriber(1, email, address, 123, dates.createdAt, dates.updatedAt);

    expect(sub.id).toBe(1);
    expect(sub.email.getValue()).toBe("user@ecorota.com");
    expect(sub.address.getStreet()).toBe("Rua A");
    expect(sub.address.getPostalCode()?.getValue()).toBe("64000000");
    expect(sub.neighborhoodId).toBe(123);
    expect(sub.createdAt).toBe(dates.createdAt);
    expect(sub.updatedAt).toBe(dates.updatedAt);
  });
});
