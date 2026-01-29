import { InvalidProblemJustificationError } from "../errors/InvalidProblemJustificationError.js";

export class ProblemJustification {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 500;

  private readonly value: string;

  constructor(justification: string) {
    const trimmedJustification = justification.trim();
    this.validate(trimmedJustification);
    this.value = trimmedJustification;
  }

  private validate(justification: string): void {
    if (justification.length < ProblemJustification.MIN_LENGTH) {
      throw new InvalidProblemJustificationError(
        `A justificativa deve ter pelo menos ${ProblemJustification.MIN_LENGTH} caracteres. Recebido: ${justification.length}`
      );
    }

    if (justification.length > ProblemJustification.MAX_LENGTH) {
      throw new InvalidProblemJustificationError(
        `A justificativa deve ter no máximo ${ProblemJustification.MAX_LENGTH} caracteres. Recebido: ${justification.length}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProblemJustification): boolean {
    if (!(other instanceof ProblemJustification)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
