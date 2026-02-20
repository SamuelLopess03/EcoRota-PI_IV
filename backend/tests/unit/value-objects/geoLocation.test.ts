import { GeoLocation } from "../../../src/domain/value-objects/GeoLocation.js";
import { InvalidGeoLocationError } from "../../../src/domain/errors/InvalidGeoLocationError.js";

describe("Value Object: GeoLocation", () => {
  it("deve criar localização com coordenadas válidas", () => {
    const geo = new GeoLocation(-5.0892, -42.8016);

    expect(geo.getLatitude()).toBe(-5.0892);
    expect(geo.getLongitude()).toBe(-42.8016);
  });

  it("deve aceitar limites extremos válidos", () => {
    const geo = new GeoLocation(90, 180);

    expect(geo.getLatitude()).toBe(90);
    expect(geo.getLongitude()).toBe(180);
  });

  it("deve aceitar limites negativos extremos válidos", () => {
    const geo = new GeoLocation(-90, -180);

    expect(geo.getLatitude()).toBe(-90);
    expect(geo.getLongitude()).toBe(-180);
  });

  it("deve lançar erro com latitude acima de 90", () => {
    expect(() => new GeoLocation(91, -42.8016)).toThrow(InvalidGeoLocationError);
  });

  it("deve lançar erro com latitude abaixo de -90", () => {
    expect(() => new GeoLocation(-91, -42.8016)).toThrow(InvalidGeoLocationError);
  });

  it("deve lançar erro com longitude acima de 180", () => {
    expect(() => new GeoLocation(-5.0892, 181)).toThrow(InvalidGeoLocationError);
  });

  it("deve lançar erro com longitude abaixo de -180", () => {
    expect(() => new GeoLocation(-5.0892, -181)).toThrow(InvalidGeoLocationError);
  });

  it("deve formatar toString corretamente", () => {
    const geo = new GeoLocation(-5.0892, -42.8016);

    expect(geo.toString()).toBe("-5.0892,-42.8016");
  });

  it("deve comparar duas localizações iguais", () => {
    const geo1 = new GeoLocation(-5.0892, -42.8016);
    const geo2 = new GeoLocation(-5.0892, -42.8016);

    expect(geo1.equals(geo2)).toBe(true);
  });

  it("deve comparar duas localizações diferentes", () => {
    const geo1 = new GeoLocation(-5.0892, -42.8016);
    const geo2 = new GeoLocation(-10.0, -50.0);

    expect(geo1.equals(geo2)).toBe(false);
  });
});
