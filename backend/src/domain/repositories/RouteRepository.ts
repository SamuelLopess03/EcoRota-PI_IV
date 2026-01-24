import { Route } from "../entities/Route.js";

export interface RouteRepository {
  create(data: Omit<Route, "id" | "created_at" | "updated_at">): Promise<Route>;
  findById(id: number): Promise<Route | null>;
  findAll(): Promise<Route[]>;
  update(id: number, data: Partial<Omit<Route, "id" | "created_at">>): Promise<Route>;
  delete(id: number): Promise<void>;
}
