export class InvalidPostalCodeError extends Error {
  constructor(message: string) {
    super(`CEP inválido: ${message}`);
    this.name = "InvalidPostalCodeError";
  }
}
