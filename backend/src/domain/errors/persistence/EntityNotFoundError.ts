import { PersistenceError } from "./PersistenceError.js";

/**
 * @class EntityNotFoundError
 * @description Lançado quando uma entidade solicitada não existe no armazenamento.
 * Reutilizável para qualquer entidade do domínio (Administrator, Ecopoint, etc).
 */
export class EntityNotFoundError extends PersistenceError {
    constructor(entityName: string, identifier: string | number) {
        super(`${entityName} com identificador '${identifier}' não foi encontrado.`);
    }
}
