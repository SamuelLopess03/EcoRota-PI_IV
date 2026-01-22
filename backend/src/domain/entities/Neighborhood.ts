import { GeoLocation } from "../value-objects/GeoLocation.js";

export class Neighborhood {
  constructor(
    public readonly id: number,
    public name: string,
    public geoLocation: GeoLocation,
    public cep: string,
    public population_estimate: number | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public route_id: number,
    public admin_id_created: number,
    public admin_id_updated: number | null
  ) {}
}
