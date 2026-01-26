import jwt from "jsonwebtoken";
import { TokenProvider } from "../../domain/providers/TokenProvider.js";
import { InvalidTokenError } from "../../domain/errors/providers/InvalidTokenError.js";
import { ProviderError } from "../../domain/errors/providers/ProviderError.js";

export class JwtTokenProvider implements TokenProvider {
  private readonly secret: string;
  private readonly defaultExpiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default_secret_key";
    this.defaultExpiresIn = process.env.JWT_EXPIRE || "1d";
    
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
      throw new ProviderError("JWT_SECRET deve ser definido em ambiente de produção");
    }
  }

  generate(payload: object, expiresIn?: string): string {
    try {
      return jwt.sign({ ...payload }, this.secret, {
        expiresIn: (expiresIn || this.defaultExpiresIn) as any,
      });
    } catch (error: any) {
      throw new ProviderError(`Erro ao gerar token: ${error.message}`, error);
    }
  }

  verify<T extends object>(token: string): T {
    try {
      const decoded = jwt.verify(token, this.secret);
      
      if (typeof decoded === 'string') {
        throw new InvalidTokenError("Payload do token inválido");
      }

      return decoded as T;
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new InvalidTokenError("Token expirado");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError("Token inválido");
      }
      if (error instanceof InvalidTokenError) {
        throw error;
      }
      throw new ProviderError(`Erro técnico na validação do token: ${error.message}`, error);
    }
  }
}
