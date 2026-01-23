import { InvalidProblemTypeError } from "../errors/InvalidProblemTypeError.js";

export class ProblemType {
  private static readonly VALID_TYPES = [
    "Coleta não realizada",
    "Lixeira danificada",
    "Lixo espalhado",
    "Outros"
  ];

  private readonly value: string;

  constructor(type: string) {
    this.validate(type);
    this.value = type;
  }

  private validate(type: string): void {
    if (!ProblemType.VALID_TYPES.includes(type)) {
      throw new InvalidProblemTypeError(
        `O tipo deve ser um dos seguintes: ${ProblemType.VALID_TYPES.join(", ")}. Recebido: ${type}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProblemType): boolean {
    if (!(other instanceof ProblemType)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public static getValidTypes(): string[] {
    return [...ProblemType.VALID_TYPES];
  }
}
