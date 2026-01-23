import { CollectionType } from "../value-objects/CollectionType.js";

export class Route {
  constructor(
    public readonly id: number,
    public name: string,
    public days_of_week: string,
    public collection_type: CollectionType,
    public start_time: Date,
    public end_time: Date,
    public created_at: Date,
    public updated_at: Date,
    public admin_id_created: number,
    public admin_id_updated: number | null
  ) {}
}
