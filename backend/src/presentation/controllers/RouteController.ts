import { Request, Response } from "express";
import { z } from "zod";
import { CreateRouteUseCase } from "../../application/use-cases/route/CreateRouteUseCase.js";
import { ListRoutesUseCase } from "../../application/use-cases/route/ListRoutesUseCase.js";
import { FindRouteByIdUseCase } from "../../application/use-cases/route/FindRouteByIdUseCase.js";
import { UpdateRouteUseCase } from "../../application/use-cases/route/UpdateRouteUseCase.js";
import { DeleteRouteUseCase } from "../../application/use-cases/route/DeleteRouteUseCase.js";
import { AuthenticatedRequest } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";

const createRouteSchema = z.object({
    name: z.string().min(3).max(255),
    collectionType: z.string().min(3).max(50),
    collectionDays: z.array(z.string()).min(1),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

const updateRouteSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    collectionType: z.string().min(3).max(50).optional(),
    collectionDays: z.array(z.string()).min(1).optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
});

/**
 * @class RouteController
 * @description Adaptador de entrada para gestão de rotas de coleta.
 */
export class RouteController {
    constructor(
        private createRouteUseCase: CreateRouteUseCase,
        private listRoutesUseCase: ListRoutesUseCase,
        private findRouteByIdUseCase: FindRouteByIdUseCase,
        private updateRouteUseCase: UpdateRouteUseCase,
        private deleteRouteUseCase: DeleteRouteUseCase
    ) { }

    /**
     * Cadastra uma nova rota.
     * POST /routes
     */
    async create(req: Request, res: Response) {
        const data = createRouteSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.createRouteUseCase.execute({
            ...data,
            adminId
        });

        return res.status(201).json(output);
    }

    /**
     * Lista todas as rotas.
     * GET /routes
     */
    async list(req: Request, res: Response) {
        const output = await this.listRoutesUseCase.execute();
        return res.status(200).json(output);
    }

    /**
     * Busca uma rota pelo ID.
     * GET /routes/:id
     */
    async findById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const output = await this.findRouteByIdUseCase.execute(id);

        return res.status(200).json(output);
    }

    /**
     * Atualiza dados de uma rota.
     * PUT /routes/:id
     */
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = updateRouteSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.updateRouteUseCase.execute(id, {
            ...data,
            adminId
        });

        return res.status(200).json(output);
    }

    /**
     * Remove uma rota.
     * DELETE /routes/:id
     */
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.deleteRouteUseCase.execute(id);

        return res.status(204).send();
    }
}
