import { ProblemJustification } from "../../../src/domain/value-objects/ProblemJustification.js";
import { InvalidProblemJustificationError } from "../../../src/domain/errors/InvalidProblemJustificationError.js";

describe("Value Object: ProblemJustification", () => {
  it("deve criar justificativa válida", () => {
    const justification = new ProblemJustification("Problema resolvido após manutenção no local.");

    expect(justification.getValue()).toBe("Problema resolvido após manutenção no local.");
  });

  it("deve remover espaços extras", () => {
    const justification = new ProblemJustification("  Problema resolvido após manutenção no local.  ");

    expect(justification.getValue()).toBe("Problema resolvido após manutenção no local.");
  });

  it("deve aceitar justificativa com exatamente 10 caracteres", () => {
    const justification = new ProblemJustification("1234567890");

    expect(justification.getValue()).toBe("1234567890");
  });

  it("deve lançar erro com justificativa muito curta (menos de 10 caracteres)", () => {
    expect(() => new ProblemJustification("curta")).toThrow(InvalidProblemJustificationError);
  });

  it("deve lançar erro com justificativa muito longa (mais de 500 caracteres)", () => {
    const longText = "a".repeat(501);

    expect(() => new ProblemJustification(longText)).toThrow(InvalidProblemJustificationError);
  });

  it("deve comparar duas justificativas iguais", () => {
    const j1 = new ProblemJustification("Problema resolvido após manutenção.");
    const j2 = new ProblemJustification("Problema resolvido após manutenção.");

    expect(j1.equals(j2)).toBe(true);
  });

  it("deve comparar duas justificativas diferentes", () => {
    const j1 = new ProblemJustification("Problema resolvido após manutenção.");
    const j2 = new ProblemJustification("Reportado sem fundamento válido.");

    expect(j1.equals(j2)).toBe(false);
  });
});
