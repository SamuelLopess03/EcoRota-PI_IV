export class InvalidPopulationEstimateError extends Error {
  constructor(message: string) {
    super(`Estimativa populacional inválida: ${message}`);
    this.name = "InvalidPopulationEstimateError";
  }
}
