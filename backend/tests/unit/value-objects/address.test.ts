import { Address } from "../../../src/domain/value-objects/Address.js";
import { InvalidAddressError } from "../../../src/domain/errors/InvalidAddressError.js";
import { PostalCode } from "../../../src/domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../src/domain/value-objects/GeoLocation.js";

describe("Value Object: Address", () => {
  it("deve criar endereço com todos os campos", () => {
    const address = new Address({
      street: "Rua A",
      number: "123",
      complement: "Casa",
      postalCode: new PostalCode("64000-000"),
      geoLocation: new GeoLocation(-5.0892, -42.8016),
    });

    expect(address.getStreet()).toBe("Rua A");
    expect(address.getNumber()).toBe("123");
    expect(address.getComplement()).toBe("Casa");
    expect(address.getPostalCode()?.getValue()).toBe("64000000");
    expect(address.getGeoLocation()?.getLatitude()).toBe(-5.0892);
  });

  it("deve criar endereço apenas com rua (campos opcionais)", () => {
    const address = new Address({ street: "Rua B" });

    expect(address.getStreet()).toBe("Rua B");
    expect(address.getNumber()).toBeUndefined();
    expect(address.getComplement()).toBeUndefined();
    expect(address.getPostalCode()).toBeUndefined();
    expect(address.getGeoLocation()).toBeUndefined();
  });

  it("deve remover espaços extras da rua", () => {
    const address = new Address({ street: "  Rua Central  " });

    expect(address.getStreet()).toBe("Rua Central");
  });

  it("deve lançar erro com rua vazia", () => {
    expect(() => new Address({ street: "" })).toThrow(InvalidAddressError);
  });

  it("deve lançar erro com rua contendo apenas espaços", () => {
    expect(() => new Address({ street: "   " })).toThrow(InvalidAddressError);
  });

  it("deve verificar presença de geolocalização", () => {
    const withGeo = new Address({
      street: "Rua A",
      geoLocation: new GeoLocation(-5.0892, -42.8016),
    });
    const withoutGeo = new Address({ street: "Rua A" });

    expect(withGeo.hasGeoLocation()).toBe(true);
    expect(withoutGeo.hasGeoLocation()).toBe(false);
  });

  it("deve formatar endereço completo", () => {
    const address = new Address({
      street: "Rua A",
      number: "123",
      complement: "Casa",
      postalCode: new PostalCode("64000-000"),
    });

    expect(address.getFullAddress()).toBe("Rua A, 123, Casa - CEP: 64000-000");
  });

  it("deve criar novo endereço com alterações (imutabilidade)", () => {
    const original = new Address({ street: "Rua A", number: "123" });
    const updated = original.withChanges({ number: "456" });

    expect(original.getNumber()).toBe("123");
    expect(updated.getNumber()).toBe("456");
    expect(updated.getStreet()).toBe("Rua A");
  });

  it("deve comparar dois endereços iguais", () => {
    const a1 = new Address({ street: "Rua A", number: "123" });
    const a2 = new Address({ street: "Rua A", number: "123" });

    expect(a1.equals(a2)).toBe(true);
  });

  it("deve comparar dois endereços diferentes", () => {
    const a1 = new Address({ street: "Rua A", number: "123" });
    const a2 = new Address({ street: "Rua B", number: "456" });

    expect(a1.equals(a2)).toBe(false);
  });
});
