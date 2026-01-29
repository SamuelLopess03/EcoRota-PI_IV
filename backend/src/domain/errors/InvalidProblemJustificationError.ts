export class InvalidProblemJustificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProblemJustificationError";
  }
}
