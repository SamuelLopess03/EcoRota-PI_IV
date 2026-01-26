import bcrypt from "bcrypt";
import { HashProvider } from "../../domain/providers/HashProvider.js";

/**
 * Implementação do HashProvider utilizando a biblioteca BCrypt.
 */
export class BCryptHashProvider implements HashProvider {
    private readonly saltRounds = 10;

    /**
     * Gera um hash para a string fornecida.
     * 
     * @param payload A string em texto puro para gerar o hash.
     * @returns Uma promessa com o hash gerado.
     */
    public async generateHash(payload: string): Promise<string> {
        return bcrypt.hash(payload, this.saltRounds);
    }

    /**
     * Compara uma string em texto puro com um hash BCrypt.
     * 
     * @param payload A string em texto puro.
     * @param hashed O hash BCrypt para comparação.
     * @returns Uma promessa que resolve com true se coincidirem.
     */
    public async compareHash(payload: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(payload, hashed);
    }
}
