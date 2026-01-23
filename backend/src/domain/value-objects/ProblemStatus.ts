import { InvalidProblemStatusError } from "../errors/InvalidProblemStatusError.js";

export class ProblemStatus {
  private static readonly VALID_STATUS = [
    "PENDING",
    "IN_ANALYSIS",
    "RESOLVED",
    "REJECTED"
  ];

  private readonly value: string;

  constructor(status: string) {
    this.validate(status);
    this.value = status;
  }

  private validate(status: string): void {
    if (!ProblemStatus.VALID_STATUS.includes(status)) {
      throw new InvalidProblemStatusError(
        `O status deve ser um dos seguintes: ${ProblemStatus.VALID_STATUS.join(", ")}. Recebido: ${status}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProblemStatus): boolean {
    if (!(other instanceof ProblemStatus)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public static getValidStatus(): string[] {
    return [...ProblemStatus.VALID_STATUS];
  }
}
