import { Route } from "../entities/Route.js";

export interface RouteRepository {
  create(data: Omit<Route, "id" | "createdAt" | "updatedAt">): Promise<Route>;
  findById(id: number): Promise<Route | null>;
  findAll(): Promise<Route[]>;
  update(id: number, data: Partial<Omit<Route, "id" | "createdAt">>): Promise<Route>;
  delete(id: number): Promise<void>;
}
