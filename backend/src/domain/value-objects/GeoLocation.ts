import { InvalidGeoLocationError } from "../errors/InvalidGeoLocationError.js";

export class GeoLocation {
  private readonly latitude: number;
  private readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    this.validate(latitude, longitude);
    this.latitude = latitude;
    this.longitude = longitude;
  }

  private validate(latitude: number, longitude: number): void {
    if (!this.isValidLatitude(latitude)) {
      throw new InvalidGeoLocationError(
        `Latitude inválida: ${latitude}. Deve estar entre -90 e 90`
      );
    }

    if (!this.isValidLongitude(longitude)) {
      throw new InvalidGeoLocationError(
        `Longitude inválida: ${longitude}. Deve estar entre -180 e 180`
      );
    }
  }

  private isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  private isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public equals(other: GeoLocation): boolean {
    if (!(other instanceof GeoLocation)) {
      return false;
    }
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  public toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
