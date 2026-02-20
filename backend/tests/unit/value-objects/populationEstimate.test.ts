import { PopulationEstimate } from "../../../src/domain/value-objects/PopulationEstimate.js";
import { InvalidPopulationEstimateError } from "../../../src/domain/errors/InvalidPopulationEstimateError.js";

describe("Value Object: PopulationEstimate", () => {
  it("deve criar estimativa com valor válido", () => {
    const pop = new PopulationEstimate(12000);

    expect(pop.getValue()).toBe(12000);
    expect(pop.isPresent()).toBe(true);
  });

  it("deve aceitar null como valor", () => {
    const pop = new PopulationEstimate(null);

    expect(pop.getValue()).toBeNull();
    expect(pop.isPresent()).toBe(false);
  });

  it("deve aceitar zero como valor válido", () => {
    const pop = new PopulationEstimate(0);

    expect(pop.getValue()).toBe(0);
    expect(pop.isPresent()).toBe(true);
  });

  it("deve lançar erro com valor negativo", () => {
    expect(() => new PopulationEstimate(-1000)).toThrow(InvalidPopulationEstimateError);
  });

  it("deve lançar erro com valor decimal", () => {
    expect(() => new PopulationEstimate(12.5)).toThrow(InvalidPopulationEstimateError);
  });

  it("deve formatar toString com valor presente", () => {
    const pop = new PopulationEstimate(12000);

    expect(pop.toString()).toBe("12000");
  });

  it("deve formatar toString com valor null", () => {
    const pop = new PopulationEstimate(null);

    expect(pop.toString()).toBe("Não informado");
  });

  it("deve comparar duas estimativas iguais", () => {
    const pop1 = new PopulationEstimate(12000);
    const pop2 = new PopulationEstimate(12000);

    expect(pop1.equals(pop2)).toBe(true);
  });

  it("deve comparar duas estimativas diferentes", () => {
    const pop1 = new PopulationEstimate(12000);
    const pop2 = new PopulationEstimate(5000);

    expect(pop1.equals(pop2)).toBe(false);
  });
});
