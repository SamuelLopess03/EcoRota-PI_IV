import { Neighborhood } from "../entities/Neighborhood.js";

export interface NeighborhoodRepository {
    /**
     * @throws {ConflictError} Se houver conflito de nome ou localização geográfica.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    create(data: Omit<Neighborhood, "id" | "createdAt" | "updatedAt">): Promise<Neighborhood>;
    
    /**
     * @throws {EntityNotFoundError} Se o bairro não for encontrado pelo ID.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findById(id: number): Promise<Neighborhood>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findAll(): Promise<Neighborhood[]>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findByRouteId(routeId: number): Promise<Neighborhood[]>;
    
    /**
     * @throws {EntityNotFoundError} Se o bairro não existir para atualização.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    update(id: number, data: Partial<Omit<Neighborhood, "id" | "createdAt">>): Promise<Neighborhood>;
    
    /**
     * @throws {EntityNotFoundError} Se o bairro não existir para deleção.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    delete(id: number): Promise<void>;
}
