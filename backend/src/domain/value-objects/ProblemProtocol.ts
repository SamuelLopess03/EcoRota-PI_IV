import { InvalidProblemProtocolError } from "../errors/InvalidProblemProtocolError.js";

export class ProblemProtocol {
  private static readonly PROTOCOL_REGEX = /^PR-\d{4}-\d{4}$/;
  private readonly value: string;

  constructor(protocol: string) {
    this.validate(protocol);
    this.value = protocol;
  }

  private validate(protocol: string): void {
    if (!protocol || protocol.trim() === "") {
      throw new InvalidProblemProtocolError("O protocolo não pode ser vazio.");
    }

    if (!ProblemProtocol.PROTOCOL_REGEX.test(protocol)) {
      throw new InvalidProblemProtocolError(
        `O protocolo deve seguir o formato PR-YYYY-NNNN (ex.: PR-2026-0001). Recebido: ${protocol}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProblemProtocol): boolean {
    if (!(other instanceof ProblemProtocol)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  /**
   * Factory method to generate a new protocol (stub for future logic)
   * @param year Current year
   * @param complement Sequential number or similar
   */
  public static generate(year: number, complement: number): ProblemProtocol {
    const paddedComplement = complement.toString().padStart(4, "0");
    return new ProblemProtocol(`PR-${year}-${paddedComplement}`);
  }
}
