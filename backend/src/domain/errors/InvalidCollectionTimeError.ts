export class InvalidCollectionTimeError extends Error {
  constructor(message: string) {
    super(`Horário de coleta inválido: ${message}`);
    this.name = "InvalidCollectionTimeError";
  }
}
