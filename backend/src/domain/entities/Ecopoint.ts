import { AcceptedMaterials } from "../value-objects/AcceptedMaterials.js";
import { Address } from "../value-objects/Address.js";
import { CollectionDays } from "../value-objects/CollectionDays.js";

export class Ecopoint {
    constructor(
        public readonly id: number,
        public name: string,
        public accepted_materials: AcceptedMaterials,
        public address: Address,
        public collection_days: CollectionDays,
        public collection_time: string,
        public neighborhood_id: number,
        public admin_id_created: number,
        public admin_id_updated: number | null,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) { }
}
