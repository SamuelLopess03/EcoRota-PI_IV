import { Email } from "../value-objects/Email.js";
import { Subscriber } from "../entities/Subscriber.js";

export interface SubscriberRepository {
    /**
     * @throws {ConflictError} Se o e-mail fornecido já estiver cadastrado.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    create(data: Omit<Subscriber, "id" | "createdAt" | "updatedAt">): Promise<Subscriber>;
    
    /**
     * @throws {EntityNotFoundError} Se o assinante não for encontrado pelo ID.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findById(id: number): Promise<Subscriber>;
    
    /**
     * Retorna null se o assinante não for encontrado pelo e-mail.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findByEmail(email: Email): Promise<Subscriber | null>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findAll(): Promise<Subscriber[]>;
    
    /**
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    findByNeighborhoodId(neighborhoodId: number): Promise<Subscriber[]>;
    
    /**
     * @throws {EntityNotFoundError} Se o assinante não existir para atualização.
     * @throws {ConflictError} Se o novo e-mail já estiver em uso por outro assinante.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    update(id: number, data: Partial<Omit<Subscriber, "id" | "createdAt">>): Promise<Subscriber>;
    
    /**
     * @throws {EntityNotFoundError} Se o assinante não existir para deleção.
     * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
     */
    delete(id: number): Promise<void>;
}
