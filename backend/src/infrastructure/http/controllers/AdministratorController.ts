import { Request, Response } from "express";
import { z } from "zod";
import { CreateAdministratorUseCase } from "../../../application/use-cases/administrator/CreateAdministratorUseCase.js";
import { AuthenticateAdministratorUseCase } from "../../../application/use-cases/administrator/AuthenticateAdministratorUseCase.js";
import { ListAdministratorsUseCase } from "../../../application/use-cases/administrator/ListAdministratorsUseCase.js";

const createAdministratorSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6),
});

const authenticateAdministratorSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export class AdministratorController {
    constructor(
        private createAdministratorUseCase: CreateAdministratorUseCase,
        private authenticateAdministratorUseCase: AuthenticateAdministratorUseCase,
        private listAdministratorsUseCase: ListAdministratorsUseCase
    ) { }

    async register(req: Request, res: Response) {
        const data = createAdministratorSchema.parse(req.body);

        const output = await this.createAdministratorUseCase.execute(data);

        return res.status(201).json(output);
    }

    async login(req: Request, res: Response) {
        const data = authenticateAdministratorSchema.parse(req.body);

        const output = await this.authenticateAdministratorUseCase.execute(data);

        return res.status(200).json(output);
    }

    async list(req: Request, res: Response) {
        const output = await this.listAdministratorsUseCase.execute();

        return res.status(200).json(output);
    }
}
