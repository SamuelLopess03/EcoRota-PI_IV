import { Neighborhood } from "../entities/Neighborhood.js";

export interface NeighborhoodRepository {
    create(data: Omit<Neighborhood, "id" | "createdAt" | "updatedAt">): Promise<Neighborhood>;
    findById(id: number): Promise<Neighborhood | null>;
    findAll(): Promise<Neighborhood[]>;
    findByRouteId(routeId: number): Promise<Neighborhood[]>;
    update(id: number, data: Partial<Omit<Neighborhood, "id" | "createdAt">>): Promise<Neighborhood>;
    delete(id: number): Promise<void>;
}
