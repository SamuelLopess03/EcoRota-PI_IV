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
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public routeId: number,
    public adminIdCreated: number,
    public adminIdUpdated: number | null
  ) { }
}
