export class InvalidProblemAttachmentsError extends Error {
  constructor(message: string) {
    super(`Anexos do problema inválidos: ${message}`);
    this.name = "InvalidProblemAttachmentsError";
  }
}
