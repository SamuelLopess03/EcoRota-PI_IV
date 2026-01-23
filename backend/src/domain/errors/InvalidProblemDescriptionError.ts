export class InvalidProblemDescriptionError extends Error {
  constructor(message: string) {
    super(`Descrição do problema inválida: ${message}`);
    this.name = "InvalidProblemDescriptionError";
  }
}
