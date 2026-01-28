/**
 * @class ProviderError
 * @description Classe base para todos os erros relacionados aos provedores de infraestrutura (JWT, Hash, etc).
 * Garante que falhas técnicas sejam encapsuladas com suporte ao erro original para depuração.
 */
export class ProviderError extends Error {
    constructor(message: string, public readonly originalError?: any) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
