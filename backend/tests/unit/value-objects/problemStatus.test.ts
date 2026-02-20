import { ProblemStatus } from "../../../src/domain/value-objects/ProblemStatus.js";
import { InvalidProblemStatusError } from "../../../src/domain/errors/InvalidProblemStatusError.js";

describe("Value Object: ProblemStatus", () => {
  it.each([
    "PENDING",
    "IN_ANALYSIS",
    "RESOLVED",
    "REJECTED",
  ])("deve criar status válido: %s", (status) => {
    const problemStatus = new ProblemStatus(status);

    expect(problemStatus.getValue()).toBe(status);
  });

  it("deve lançar erro com status inválido", () => {
    expect(() => new ProblemStatus("INVALIDO")).toThrow(InvalidProblemStatusError);
  });

  it("deve comparar dois status iguais", () => {
    const s1 = new ProblemStatus("PENDING");
    const s2 = new ProblemStatus("PENDING");

    expect(s1.equals(s2)).toBe(true);
  });

  it("deve comparar dois status diferentes", () => {
    const s1 = new ProblemStatus("PENDING");
    const s2 = new ProblemStatus("RESOLVED");

    expect(s1.equals(s2)).toBe(false);
  });

  it("deve retornar lista de status válidos", () => {
    const validStatus = ProblemStatus.getValidStatus();

    expect(validStatus).toContain("PENDING");
    expect(validStatus).toContain("RESOLVED");
    expect(validStatus.length).toBe(4);
  });
});
