import { ProviderError } from "./ProviderError.js";

/**
 * @class InvalidTokenError
 * @description Erro lançado quando um token de autenticação é inválido, expirado ou malformado.
 */
export class InvalidTokenError extends ProviderError {
    constructor(message: string = "Token inválido ou expirado", originalError?: any) {
        super(message, originalError);
    }
}
