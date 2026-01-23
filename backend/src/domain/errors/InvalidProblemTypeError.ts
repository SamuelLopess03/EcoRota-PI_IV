export class InvalidProblemTypeError extends Error {
  constructor(message: string) {
    super(`Tipo de problema inválido: ${message}`);
    this.name = "InvalidProblemTypeError";
  }
}
