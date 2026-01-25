import { Email } from "../value-objects/Email.js";
import { Administrator } from "../entities/Administrator.js";

export interface AdministratorRepository {
  /**
   * @throws {ConflictError} Se o e-mail já estiver em uso.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  create(admin: Omit<Administrator, "id" | "creationDate" | "updateDate">): Promise<Administrator>;
  
  /**
   * Retorna null se o administrador não for encontrado.
   * @description Retorna null se o administrador não for encontrado.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findByEmail(email: Email): Promise<Administrator | null>;
  
  /**
   * @throws {EntityNotFoundError} Se o administrador com o ID fornecido não existir.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findById(id: number): Promise<Administrator>;

  /**
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findAll(): Promise<Administrator[]>;

  /**
   * @throws {EntityNotFoundError} Se o administrador não existir.
   * @throws {ConflictError} Se tentar atualizar para um e-mail que já pertence a outro administrador.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  update(id: number, data: Partial<Omit<Administrator, "id" | "creationDate">>): Promise<Administrator>;

  /**
   * @throws {EntityNotFoundError} Se o administrador não existir para deleção.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  delete(id: number): Promise<void>;
}
