import { PopulationEstimate } from "../value-objects/PopulationEstimate.js";
import { PostalCode } from "../value-objects/PostalCode.js";
import { GeoLocation } from "../value-objects/GeoLocation.js";

export class Neighborhood {
  constructor(
    public readonly id: number,
    public name: string,
    public populationEstimate: PopulationEstimate,
    public postalCode: PostalCode,
    public geoLocation: GeoLocation,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public route_id: number,
    public admin_id_created: number,
    public admin_id_updated: number | null
  ) {}
}
