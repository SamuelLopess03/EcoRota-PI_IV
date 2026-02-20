import { ProblemType } from "../../../src/domain/value-objects/ProblemType.js";
import { InvalidProblemTypeError } from "../../../src/domain/errors/InvalidProblemTypeError.js";

describe("Value Object: ProblemType", () => {
  it.each([
    "Coleta não realizada",
    "Lixeira danificada",
    "Lixo espalhado",
    "Outros",
  ])("deve criar tipo válido: %s", (type) => {
    const problemType = new ProblemType(type);

    expect(problemType.getValue()).toBe(type);
  });

  it("deve lançar erro com tipo inválido", () => {
    expect(() => new ProblemType("Tipo inexistente")).toThrow(InvalidProblemTypeError);
  });

  it("deve comparar dois tipos iguais", () => {
    const t1 = new ProblemType("Lixo espalhado");
    const t2 = new ProblemType("Lixo espalhado");

    expect(t1.equals(t2)).toBe(true);
  });

  it("deve retornar lista de tipos válidos", () => {
    const validTypes = ProblemType.getValidTypes();

    expect(validTypes).toContain("Outros");
    expect(validTypes.length).toBe(4);
  });
});
