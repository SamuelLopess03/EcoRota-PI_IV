import { Request, Response } from "express";
import { z } from "zod";
import { CreateNeighborhoodUseCase } from "../../application/use-cases/neighborhood/CreateNeighborhoodUseCase.js";
import { ListNeighborhoodsUseCase } from "../../application/use-cases/neighborhood/ListNeighborhoodsUseCase.js";
import { FindNeighborhoodByIdUseCase } from "../../application/use-cases/neighborhood/FindNeighborhoodByIdUseCase.js";
import { UpdateNeighborhoodUseCase } from "../../application/use-cases/neighborhood/UpdateNeighborhoodUseCase.js";
import { DeleteNeighborhoodUseCase } from "../../application/use-cases/neighborhood/DeleteNeighborhoodUseCase.js";
import { AuthenticatedRequest } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";

const createNeighborhoodSchema = z.object({
    name: z.string().min(2).max(255),
    populationEstimate: z.number().int().positive().nullable(),
    postalCode: z.string().length(8),
    latitude: z.number(),
    longitude: z.number(),
    routeId: z.number().int().positive(),
});

const updateNeighborhoodSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    populationEstimate: z.number().int().positive().nullable().optional(),
    postalCode: z.string().length(8).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    routeId: z.number().int().positive().optional(),
});

/**
 * @class NeighborhoodController
 * @description Adaptador de entrada para gestão de bairros.
 */
export class NeighborhoodController {
    constructor(
        private createNeighborhoodUseCase: CreateNeighborhoodUseCase,
        private listNeighborhoodsUseCase: ListNeighborhoodsUseCase,
        private findNeighborhoodByIdUseCase: FindNeighborhoodByIdUseCase,
        private updateNeighborhoodUseCase: UpdateNeighborhoodUseCase,
        private deleteNeighborhoodUseCase: DeleteNeighborhoodUseCase
    ) { }

    /**
     * Cadastra um novo bairro.
     * POST /neighborhoods
     */
    async create(req: Request, res: Response) {
        const data = createNeighborhoodSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.createNeighborhoodUseCase.execute({
            ...data,
            adminId
        });

        return res.status(201).json(output);
    }

    /**
     * Lista bairros com filtro opcional por rota.
     * GET /neighborhoods
     */
    async list(req: Request, res: Response) {
        const routeId = req.query.routeId ? Number(req.query.routeId) : undefined;
        const output = await this.listNeighborhoodsUseCase.execute(routeId);

        return res.status(200).json(output);
    }

    /**
     * Busca um bairro pelo ID.
     * GET /neighborhoods/:id
     */
    async findById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const output = await this.findNeighborhoodByIdUseCase.execute(id);

        return res.status(200).json(output);
    }

    /**
     * Atualiza dados de um bairro.
     * PUT /neighborhoods/:id
     */
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = updateNeighborhoodSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.updateNeighborhoodUseCase.execute(id, {
            ...data,
            adminId
        });

        return res.status(200).json(output);
    }

    /**
     * Remove um bairro.
     * DELETE /neighborhoods/:id
     */
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.deleteNeighborhoodUseCase.execute(id);

        return res.status(204).send();
    }
}
