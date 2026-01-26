/**
 * Interface que define o contrato para provedores de criptografia (hash).
 */
export interface HashProvider {
    /**
     * Gera um hash a partir de um valor em texto puro.
     * 
     * @param payload O valor a ser criptografado.
     * @returns Uma promessa que resolve com o hash gerado.
     */
    generateHash(payload: string): Promise<string>;

    /**
     * Compara um valor em texto puro com um hash existente.
     * 
     * @param payload O valor em texto puro a ser comparado.
     * @param hashed O hash contra o qual comparar.
     * @returns Uma promessa que resolve com true se os valores coincidirem, false caso contrário.
     */
    compareHash(payload: string, hashed: string): Promise<boolean>;
}
