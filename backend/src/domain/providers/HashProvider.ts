export interface HashProvider {
    /**
     * Gera um hash a partir de um valor em texto puro.
     * @param payload O valor a ser criptografado.
     * @returns Uma promessa que resolve com o hash gerado.
     * @throws {HashingError} Se ocorrer uma falha ao gerar o hash.
     */
    generateHash(payload: string): Promise<string>;

    /**
     * Compara um valor em texto puro com um hash existente.
     * @param payload O valor em texto puro a ser comparado.
     * @param hashed O hash contra o qual comparar.
     * @returns Uma promessa que resolve com true se os valores coincidirem, false caso contrário.
     * @throws {HashingError} Se ocorrer uma falha na comparação.
     */
    compareHash(payload: string, hashed: string): Promise<boolean>;
}
