import { Route } from "../entities/Route.js";

export interface RouteRepository {
  /**
   * @throws {ConflictError} Se houver conflito de nome da rota.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  create(data: Omit<Route, "id" | "createdAt" | "updatedAt">): Promise<Route>;
  
  /**
   * @throws {EntityNotFoundError} Se a rota não for encontrada pelo ID.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findById(id: number): Promise<Route>;
  
  /**
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findAll(): Promise<Route[]>;
  
  /**
   * @throws {EntityNotFoundError} Se a rota não existir para atualização.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  update(id: number, data: Partial<Omit<Route, "id" | "createdAt">>): Promise<Route>;
  
  /**
   * @throws {EntityNotFoundError} Se a rota não existir para deleção.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  delete(id: number): Promise<void>;
}
