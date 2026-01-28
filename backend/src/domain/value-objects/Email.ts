import { InvalidEmailError } from "../errors/InvalidEmailError.js";

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.validate(email)) {
      throw new InvalidEmailError(email);
    }
    this.value = email.toLowerCase().trim();
  }

  private validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }
}
