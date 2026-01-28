import { InvalidCollectionTypeError } from "../errors/InvalidCollectionTypeError.js";

export class CollectionType {
  private static readonly VALID_TYPES = [
    "Coleta regular",
    "Coleta seletiva",
    "Coleta especial",
    "Coleta agendada"
  ];

  private readonly value: string;

  constructor(type: string) {
    const normalizedType = type.trim();
    this.validate(normalizedType);
    this.value = normalizedType;
  }

  private validate(type: string): void {
    if (!CollectionType.VALID_TYPES.includes(type)) {
      throw new InvalidCollectionTypeError(
        `O tipo de coleta deve ser um dos seguintes: ${CollectionType.VALID_TYPES.join(", ")}. Recebido: ${type}`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: CollectionType): boolean {
    if (!(other instanceof CollectionType)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public static getValidTypes(): string[] {
    return [...CollectionType.VALID_TYPES];
  }
}
