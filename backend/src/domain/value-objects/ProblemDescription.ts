import { InvalidProblemDescriptionError } from "../errors/InvalidProblemDescriptionError.js";

export class ProblemDescription {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 500;

  private readonly value: string;

  constructor(description: string) {
    const trimmedDescription = description.trim();
    this.validate(trimmedDescription);
    this.value = trimmedDescription;
  }

  private validate(description: string): void {
    if (description.length < ProblemDescription.MIN_LENGTH) {
      throw new InvalidProblemDescriptionError(
        `A descrição deve ter pelo menos ${ProblemDescription.MIN_LENGTH} caracteres. Recebido: ${description.length}`
      );
    }

    if (description.length > ProblemDescription.MAX_LENGTH) {
      throw new InvalidProblemDescriptionError(
        `A descrição deve ter no máximo ${ProblemDescription.MAX_LENGTH} caracteres. Recebido: ${description.length}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProblemDescription): boolean {
    if (!(other instanceof ProblemDescription)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
