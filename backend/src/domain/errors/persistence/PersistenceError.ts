/**
 * @class PersistenceError
 * @description Classe base para todos os erros relacionados à camada de persistência.
 * Garante que falhas de infraestrutura não vazem detalhes técnicos para o domínio.
 */
export class PersistenceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
