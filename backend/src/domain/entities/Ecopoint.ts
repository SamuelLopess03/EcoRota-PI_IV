export class Ecopoint {
    constructor(
        public readonly id: number,
        public name: string,
        public address: string,
        public accepted_materials: string,
        public collection_days: string,
        public collection_time: string,
        public neighborhood_id: number,
        public admin_id_created: number,
        public admin_id_updated: number | null,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) { }
}
