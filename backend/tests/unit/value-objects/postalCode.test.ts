import { PostalCode } from "../../../src/domain/value-objects/PostalCode.js";
import { InvalidPostalCodeError } from "../../../src/domain/errors/InvalidPostalCodeError.js";

describe("Value Object: PostalCode", () => {
  it("deve criar CEP válido com hífen", () => {
    const cep = new PostalCode("64000-000");

    expect(cep.getValue()).toBe("64000000");
  });

  it("deve criar CEP válido sem hífen", () => {
    const cep = new PostalCode("64000000");

    expect(cep.getValue()).toBe("64000000");
  });

  it("deve formatar CEP corretamente", () => {
    const cep = new PostalCode("64000000");

    expect(cep.getFormatted()).toBe("64000-000");
  });

  it("deve lançar erro com CEP muito curto", () => {
    expect(() => new PostalCode("6400")).toThrow(InvalidPostalCodeError);
  });

  it("deve lançar erro com CEP muito longo", () => {
    expect(() => new PostalCode("640000001")).toThrow(InvalidPostalCodeError);
  });

  it("deve comparar dois CEPs iguais", () => {
    const cep1 = new PostalCode("64000-000");
    const cep2 = new PostalCode("64000000");

    expect(cep1.equals(cep2)).toBe(true);
  });

  it("deve comparar dois CEPs diferentes", () => {
    const cep1 = new PostalCode("64000-000");
    const cep2 = new PostalCode("01001-000");

    expect(cep1.equals(cep2)).toBe(false);
  });
});
