import { CollectionDays } from "../value-objects/CollectionDays.js";
import { CollectionTime } from "../value-objects/CollectionTime.js";
import { CollectionType } from "../value-objects/CollectionType.js";

export class Route {
  constructor(
    public readonly id: number,
    public name: string,
    public collectionDays: CollectionDays,
    public collectionTime: CollectionTime,
    public collectionType: CollectionType,
    public createdAt: Date,
    public updatedAt: Date,
    public adminIdCreated: number,
    public adminIdUpdated: number | null
  ) { }
}
