import { ProblemDescription } from "../../../src/domain/value-objects/ProblemDescription.js";
import { InvalidProblemDescriptionError } from "../../../src/domain/errors/InvalidProblemDescriptionError.js";

describe("Value Object: ProblemDescription", () => {
  it("deve criar descrição válida", () => {
    const desc = new ProblemDescription("Lixo espalhado na calçada há dias.");

    expect(desc.getValue()).toBe("Lixo espalhado na calçada há dias.");
  });

  it("deve remover espaços extras", () => {
    const desc = new ProblemDescription("  Lixo espalhado na calçada há dias.  ");

    expect(desc.getValue()).toBe("Lixo espalhado na calçada há dias.");
  });

  it("deve aceitar descrição com exatamente 10 caracteres", () => {
    const desc = new ProblemDescription("1234567890");

    expect(desc.getValue()).toBe("1234567890");
  });

  it("deve lançar erro com descrição muito curta (menos de 10 caracteres)", () => {
    expect(() => new ProblemDescription("curta")).toThrow(InvalidProblemDescriptionError);
  });

  it("deve lançar erro com descrição muito longa (mais de 500 caracteres)", () => {
    const longText = "a".repeat(501);

    expect(() => new ProblemDescription(longText)).toThrow(InvalidProblemDescriptionError);
  });

  it("deve comparar duas descrições iguais", () => {
    const d1 = new ProblemDescription("Lixo espalhado na calçada há dias.");
    const d2 = new ProblemDescription("Lixo espalhado na calçada há dias.");

    expect(d1.equals(d2)).toBe(true);
  });

  it("deve comparar duas descrições diferentes", () => {
    const d1 = new ProblemDescription("Lixo espalhado na calçada há dias.");
    const d2 = new ProblemDescription("Lixeira danificada na esquina.");

    expect(d1.equals(d2)).toBe(false);
  });
});
