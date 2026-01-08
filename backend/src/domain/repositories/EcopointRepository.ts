import { Ecopoint } from "../entities/Ecopoint.js";

export interface EcopointRepository {
    create(data: Omit<Ecopoint, "id" | "created_at" | "updated_at">): Promise<Ecopoint>;
    findById(id: number): Promise<Ecopoint | null>;
    findAll(): Promise<Ecopoint[]>;
    findByNeighborhoodId(neighborhoodId: number): Promise<Ecopoint[]>;
    update(id: number, data: Partial<Omit<Ecopoint, "id" | "created_at">>): Promise<Ecopoint>;
    delete(id: number): Promise<void>;
}
