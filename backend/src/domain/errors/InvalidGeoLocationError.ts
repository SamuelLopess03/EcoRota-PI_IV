export class InvalidGeoLocationError extends Error {
  constructor(message: string) {
    super(`Localização geográfica inválida: ${message}`);
    this.name = "InvalidGeoLocationError";
  }
}
