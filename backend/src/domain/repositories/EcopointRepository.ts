import { Ecopoint } from "../entities/Ecopoint.js";

export interface EcopointRepository {
    create(data: Omit<Ecopoint, "id" | "createdAt" | "updatedAt">): Promise<Ecopoint>;
    findById(id: number): Promise<Ecopoint | null>;
    findAll(): Promise<Ecopoint[]>;
    findByNeighborhoodId(neighborhoodId: number): Promise<Ecopoint[]>;
    update(id: number, data: Partial<Omit<Ecopoint, "id" | "createdAt">>): Promise<Ecopoint>;
    delete(id: number): Promise<void>;
}
