import { PersistenceError } from "./PersistenceError.js";

/**
 * @class DependencyError
 * @description Lançado quando uma operação de persistência falha devido a dependências
 * existentes (ex: tentar excluir um registro que possui chaves estrangeiras vinculadas).
 */
export class DependencyError extends PersistenceError {
    constructor(message: string) {
        super(message);
    }
}
