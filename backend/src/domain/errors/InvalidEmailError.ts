export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`O e-mail informado é inválido: ${email}`);
    this.name = "InvalidEmailError";
  }
}
