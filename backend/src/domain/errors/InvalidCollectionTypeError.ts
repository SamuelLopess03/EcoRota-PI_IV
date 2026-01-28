export class InvalidCollectionTypeError extends Error {
  constructor(message: string) {
    super(`Tipo de coleta inválido: ${message}`);
    this.name = "InvalidCollectionTypeError";
  }
}
