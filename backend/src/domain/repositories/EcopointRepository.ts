import { Ecopoint } from "../entities/Ecopoint.js";

export interface EcopointRepository {
    /**
     * @throws {ConflictError} Se houver duplicidade de dados críticos.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    create(data: Omit<Ecopoint, "id" | "createdAt" | "updatedAt">): Promise<Ecopoint>;
    
    /**
     * @throws {EntityNotFoundError} Se o ecoponto não for encontrado pelo ID.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findById(id: number): Promise<Ecopoint>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findAll(): Promise<Ecopoint[]>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findByNeighborhoodId(neighborhoodId: number): Promise<Ecopoint[]>;
    
    /**
     * @throws {EntityNotFoundError} Se o ecoponto não existir para atualização.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    update(id: number, data: Partial<Omit<Ecopoint, "id" | "createdAt">>): Promise<Ecopoint>;
    
    /**
     * @throws {EntityNotFoundError} Se o ecoponto não existir para deleção.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    delete(id: number): Promise<void>;
}
