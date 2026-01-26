export class InvalidTokenError extends Error {
  constructor(message: string = "Token inválido ou expirado") {
    super(message);
    this.name = "InvalidTokenError";
  }
}
