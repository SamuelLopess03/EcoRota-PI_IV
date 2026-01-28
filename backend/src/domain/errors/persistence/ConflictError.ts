import { PersistenceError } from "./PersistenceError.js";

/**
 * @class ConflictError
 * @description Lançado quando ocorre um conflito de dados na persistência, 
 * geralmente devido a violações de chaves únicas (ex: email já cadastrado).
 */
export class ConflictError extends PersistenceError {
    constructor(message: string) {
        super(message);
    }
}
