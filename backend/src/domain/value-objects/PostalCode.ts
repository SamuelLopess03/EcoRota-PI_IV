import { InvalidPostalCodeError } from "../errors/InvalidPostalCodeError.js";

export class PostalCode {
  private readonly value: string;

  constructor(cep: string) {
    const normalized = this.normalize(cep);
    this.validate(normalized);
    this.value = normalized;
  }

  private normalize(cep: string): string {
    return cep.replace(/\D/g, "");
  }

  private validate(cep: string): void {
    if (!/^\d+$/.test(cep)) {
      throw new InvalidPostalCodeError("O CEP deve conter apenas números");
    }

    if (cep.length !== 8) {
      throw new InvalidPostalCodeError(
        `O CEP deve ter exatamente 8 dígitos. Recebido: ${cep.length} dígitos`
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public getFormatted(): string {
    return `${this.value.substring(0, 5)}-${this.value.substring(5)}`;
  }

  public equals(other: PostalCode): boolean {
    if (!(other instanceof PostalCode)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
