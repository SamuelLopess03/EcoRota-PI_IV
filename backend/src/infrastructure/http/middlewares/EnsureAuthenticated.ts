import { NextFunction, Request, Response } from "express";
import { TokenProvider } from "../../../domain/providers/TokenProvider.js";
import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { InvalidTokenError } from "../../../domain/errors/providers/InvalidTokenError.js";

interface TokenPayload {
    sub: number;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    administrator: {
        id: number;
        email: string;
    };
}

/**
 * @function ensureAuthenticated
 * @description Middleware que valida o token JWT e a existência do administrador no banco de dados.
 */
export function ensureAuthenticated(
    tokenProvider: TokenProvider,
    administratorRepository: AdministratorRepository
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new InvalidTokenError("Token ausente"));
        }

        const [, token] = authHeader.split(" ");

        if (!token) {
            return next(new InvalidTokenError("Token malformado"));
        }

        try {
            const decoded = tokenProvider.verify<TokenPayload>(token);

            // Valida se o administrador ainda existe no banco
            const administrator = await administratorRepository.findById(decoded.sub);

            // Injeta dados do administrador no request para uso posterior
            (req as AuthenticatedRequest).administrator = {
                id: administrator.id,
                email: administrator.email.getValue(),
            };

            return next();
        } catch (error) {
            return next(error);
        }
    };
}
