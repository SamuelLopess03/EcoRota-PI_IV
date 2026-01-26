import bcrypt from "bcrypt";
import { HashProvider } from "../../domain/providers/HashProvider.js";
import { HashingError } from "../../domain/errors/providers/HashingError.js";

export class BCryptHashProvider implements HashProvider {
    private readonly saltRounds = 10;

    public async generateHash(payload: string): Promise<string> {
        try {
            return await bcrypt.hash(payload, this.saltRounds);
        } catch (error) {
            throw new HashingError("Falha ao gerar hash de segurança.", error);
        }
    }

    public async compareHash(payload: string, hashed: string): Promise<boolean> {
        try {
            return await bcrypt.compare(payload, hashed);
        } catch (error) {
            throw new HashingError("Falha ao validar credenciais cifradas.", error);
        }
    }
}