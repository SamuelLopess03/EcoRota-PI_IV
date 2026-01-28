import { NextFunction, Request, Response } from "express";
import { ProviderError } from "../../../domain/errors/providers/ProviderError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { InvalidEmailError } from "../../../domain/errors/InvalidEmailError.js";
import { InvalidAddressError } from "../../../domain/errors/InvalidAddressError.js";
import { InvalidTokenError } from "../../../domain/errors/providers/InvalidTokenError.js";
import { InvalidCredentialsError } from "../../../application/use-cases/administrator/errors/InvalidCredentialsError.js";

/**
 * @function ErrorHandler
 * @description Middleware global que intercepta erros e os converte em respostas HTTP padronizadas.
 */
export const ErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Erros de Validação de Domínio (400 Bad Request)
    if (
        error instanceof InvalidEmailError ||
        error instanceof InvalidAddressError ||
        error.name.startsWith("Invalid")
    ) {
        return res.status(400).json({ error: error.message });
    }

    // Erros de Autenticação (401 Unauthorized)
    if (error instanceof InvalidTokenError || error instanceof InvalidCredentialsError) {
        return res.status(401).json({ error: error.message });
    }

    // Erros de Entidade Não Encontrada (404 Not Found)
    if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
    }

    // Erros de Conflito (409 Conflict)
    if (error instanceof ConflictError) {
        return res.status(409).json({ error: error.message });
    }

    // Erros de Infraestrutura/Persistência (500 Internal Server Error)
    if (error instanceof PersistenceError || error instanceof ProviderError) {
        console.error(`[Infrastructure Error] ${error.name}: ${error.message}`, (error as any).originalError || "");
        return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }

    // Erro Genérico não tratado
    console.error("[Unhandled Error]", error);
    return res.status(500).json({
        error: "Erro inesperado. Por favor, tente novamente mais tarde.",
    });
};
