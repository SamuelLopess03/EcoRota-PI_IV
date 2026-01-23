export class InvalidProblemStatusError extends Error {
  constructor(message: string) {
    super(`Status do problema inválido: ${message}`);
    this.name = "InvalidProblemStatusError";
  }
}
