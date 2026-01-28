export class InvalidProblemProtocolError extends Error {
  constructor(message: string) {
    super(`Protocolo de problema inválido: ${message}`);
    this.name = "InvalidProblemProtocolError";
  }
}
