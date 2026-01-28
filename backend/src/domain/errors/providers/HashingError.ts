import { ProviderError } from "./ProviderError.js";

/**
 * @class HashingError
 * @description Erro lançado quando ocorre uma falha no processo de geração ou comparação de hash.
 */
export class HashingError extends ProviderError {
    constructor(message: string = "Erro ao processar hash de dados.", originalError?: any) {
        super(message, originalError);
    }
}
