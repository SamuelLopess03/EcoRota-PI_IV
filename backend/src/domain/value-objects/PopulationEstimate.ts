import { InvalidPopulationEstimateError } from "../errors/InvalidPopulationEstimateError.js";

export class PopulationEstimate {
  private readonly value: number | null;

  constructor(estimate: number | null) {
    if (estimate !== null) {
      this.validate(estimate);
    }
    this.value = estimate;
  }

  private validate(estimate: number): void {
    if (estimate < 0) {
      throw new InvalidPopulationEstimateError(
        `O valor não pode ser negativo. Recebido: ${estimate}`
      );
    }

    if (!Number.isInteger(estimate)) {
      throw new InvalidPopulationEstimateError(
        `O valor deve ser um número inteiro. Recebido: ${estimate}`
      );
    }
  }

  public getValue(): number | null {
    return this.value;
  }

  public isPresent(): boolean {
    return this.value !== null;
  }

  public equals(other: PopulationEstimate): boolean {
    if (!(other instanceof PopulationEstimate)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value !== null ? this.value.toString() : "Não informado";
  }
}
