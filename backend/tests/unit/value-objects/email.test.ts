import { Email } from "../../../src/domain/value-objects/Email.js";
import { InvalidEmailError } from "../../../src/domain/errors/InvalidEmailError.js";

describe("Value Object: Email", () => {
  it("deve criar email com valor válido", () => {
    const email = new Email("admin@ecorota.com");

    expect(email.getValue()).toBe("admin@ecorota.com");
  });

  it("deve normalizar email para minúsculas", () => {
    const email = new Email("ADMIN@EcoRota.COM");

    expect(email.getValue()).toBe("admin@ecorota.com");
  });

  it("deve lançar erro com email sem @", () => {
    expect(() => new Email("email-invalido")).toThrow(InvalidEmailError);
  });

  it("deve lançar erro com email sem domínio", () => {
    expect(() => new Email("admin@")).toThrow(InvalidEmailError);
  });

  it("deve lançar erro com email sem usuário", () => {
    expect(() => new Email("@ecorota.com")).toThrow(InvalidEmailError);
  });

  it("deve lançar erro com email contendo espaços no meio", () => {
    expect(() => new Email("admin @ecorota.com")).toThrow(InvalidEmailError);
  });
});
