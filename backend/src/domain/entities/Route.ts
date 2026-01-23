import { CollectionDays } from "../value-objects/CollectionDays.js";
import { CollectionTime } from "../value-objects/CollectionTime.js";

export class Route {
  constructor(
    public readonly id: number,
    public name: string,
    public collection_days: CollectionDays,
    public collection_type: string,
    public collection_time: CollectionTime,
    public created_at: Date,
    public updated_at: Date,
    public admin_id_created: number,
    public admin_id_updated: number | null
  ) {}
}
