import { ProblemProtocol } from "../../../src/domain/value-objects/ProblemProtocol.js";
import { InvalidProblemProtocolError } from "../../../src/domain/errors/InvalidProblemProtocolError.js";

describe("Value Object: ProblemProtocol", () => {
  it("deve criar protocolo com formato válido", () => {
    const protocol = new ProblemProtocol("PR-2025-0001");

    expect(protocol.getValue()).toBe("PR-2025-0001");
  });

  it("deve lançar erro com protocolo vazio", () => {
    expect(() => new ProblemProtocol("")).toThrow(InvalidProblemProtocolError);
  });

  it("deve lançar erro com formato inválido", () => {
    expect(() => new ProblemProtocol("PROTOCOLO-123")).toThrow(InvalidProblemProtocolError);
  });

  it("deve lançar erro com protocolo faltando prefixo PR", () => {
    expect(() => new ProblemProtocol("XX-2025-0001")).toThrow(InvalidProblemProtocolError);
  });

  it("deve gerar protocolo via factory method", () => {
    const protocol = ProblemProtocol.generate(2026, 42);

    expect(protocol.getValue()).toBe("PR-2026-0042");
  });

  it("deve gerar protocolo com padding correto", () => {
    const protocol = ProblemProtocol.generate(2026, 1);

    expect(protocol.getValue()).toBe("PR-2026-0001");
  });

  it("deve comparar dois protocolos iguais", () => {
    const p1 = new ProblemProtocol("PR-2025-0001");
    const p2 = new ProblemProtocol("PR-2025-0001");

    expect(p1.equals(p2)).toBe(true);
  });

  it("deve comparar dois protocolos diferentes", () => {
    const p1 = new ProblemProtocol("PR-2025-0001");
    const p2 = new ProblemProtocol("PR-2025-0002");

    expect(p1.equals(p2)).toBe(false);
  });
});
