import { AcceptedMaterials } from "../value-objects/AcceptedMaterials.js";
import { GeoLocation } from "../value-objects/GeoLocation.js";
import { CollectionDays } from "../value-objects/CollectionDays.js";
import { CollectionTime } from "../value-objects/CollectionTime.js";

export class Ecopoint {
    constructor(
        public readonly id: number,
        public name: string,
        public partnerName: string | null,
        public acceptedMaterials: AcceptedMaterials,
        public geoLocation: GeoLocation,
        public collectionDays: CollectionDays,
        public collectionTime: CollectionTime,
        public neighborhoodId: number,
        public adminIdCreated: number,
        public adminIdUpdated: number | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}
