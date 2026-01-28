import { Request, Response } from "express";
import { z } from "zod";
import { CreateEcopointUseCase } from "../../application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { ListEcopointsUseCase } from "../../application/use-cases/ecopoint/ListEcopointsUseCase.js";
import { FindEcopointByIdUseCase } from "../../application/use-cases/ecopoint/FindEcopointByIdUseCase.js";
import { UpdateEcopointUseCase } from "../../application/use-cases/ecopoint/UpdateEcopointUseCase.js";
import { DeleteEcopointUseCase } from "../../application/use-cases/ecopoint/DeleteEcopointUseCase.js";
import { AuthenticatedRequest } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";

const createEcopointSchema = z.object({
    name: z.string().min(3).max(255),
    materials: z.array(z.string()).min(1),
    street: z.string().min(3).max(255),
    number: z.string().max(20).optional(),
    complement: z.string().max(255).optional(),
    postalCode: z.string().length(8).optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    collectionDays: z.array(z.string()).min(1),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    neighborhoodId: z.number().int().positive(),
});

const updateEcopointSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    materials: z.array(z.string()).min(1).optional(),
    street: z.string().min(3).max(255).optional(),
    number: z.string().max(20).optional(),
    complement: z.string().max(255).optional(),
    postalCode: z.string().length(8).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    collectionDays: z.array(z.string()).min(1).optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    neighborhoodId: z.number().int().positive().optional(),
});

/**
 * @class EcopointController
 * @description Adaptador de entrada para gestão de ecopontos.
 */
export class EcopointController {
    constructor(
        private createEcopointUseCase: CreateEcopointUseCase,
        private listEcopointsUseCase: ListEcopointsUseCase,
        private findEcopointByIdUseCase: FindEcopointByIdUseCase,
        private updateEcopointUseCase: UpdateEcopointUseCase,
        private deleteEcopointUseCase: DeleteEcopointUseCase
    ) { }

    /**
     * Cadastra um novo ecoponto.
     * POST /ecopoints
     */
    async create(req: Request, res: Response) {
        const data = createEcopointSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.createEcopointUseCase.execute({
            ...data,
            adminId
        });

        return res.status(201).json(output);
    }

    /**
     * Lista todos os ecopontos com filtros opcionais.
     * GET /ecopoints
     */
    async list(req: Request, res: Response) {
        const neighborhoodId = req.query.neighborhoodId ? Number(req.query.neighborhoodId) : undefined;
        const output = await this.listEcopointsUseCase.execute(neighborhoodId);

        return res.status(200).json(output);
    }

    /**
     * Busca um ecoponto pelo ID.
     * GET /ecopoints/:id
     */
    async findById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const output = await this.findEcopointByIdUseCase.execute(id);

        return res.status(200).json(output);
    }

    /**
     * Atualiza dados de um ecoponto.
     * PUT /ecopoints/:id
     */
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = updateEcopointSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.updateEcopointUseCase.execute(id, {
            ...data,
            adminId
        });

        return res.status(200).json(output);
    }

    /**
     * Remove um ecoponto.
     * DELETE /ecopoints/:id
     */
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.deleteEcopointUseCase.execute(id);

        return res.status(204).send();
    }
}
