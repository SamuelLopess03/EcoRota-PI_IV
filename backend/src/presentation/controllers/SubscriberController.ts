import { Request, Response } from "express";
import { z } from "zod";
import { RegisterSubscriberUseCase } from "../../application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { ListSubscribersUseCase } from "../../application/use-cases/subscriber/ListSubscribersUseCase.js";
import { FindSubscriberByIdUseCase } from "../../application/use-cases/subscriber/FindSubscriberByIdUseCase.js";
import { UpdateSubscriberProfileUseCase } from "../../application/use-cases/subscriber/UpdateSubscriberProfileUseCase.js";
import { UnsubscribeUseCase } from "../../application/use-cases/subscriber/UnsubscribeUseCase.js";

const registerSubscriberSchema = z.object({
    email: z.string().email(),
    street: z.string().min(3).max(255),
    number: z.string().min(1).max(20),
    complement: z.string().max(255).optional(),
    postalCode: z.string().length(8).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    neighborhoodId: z.number().int().positive(),
});

const updateSubscriberSchema = z.object({
    email: z.string().email().optional(),
    street: z.string().min(3).max(255).optional(),
    number: z.string().min(1).max(20).optional(),
    complement: z.string().max(255).optional(),
    postalCode: z.string().length(8).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    neighborhoodId: z.number().int().positive().optional(),
});

/**
 * @class SubscriberController
 * @description Adaptador de entrada para gestão de assinantes.
 */
export class SubscriberController {
    constructor(
        private registerSubscriberUseCase: RegisterSubscriberUseCase,
        private listSubscribersUseCase: ListSubscribersUseCase,
        private findSubscriberByIdUseCase: FindSubscriberByIdUseCase,
        private updateSubscriberProfileUseCase: UpdateSubscriberProfileUseCase,
        private unsubscribeUseCase: UnsubscribeUseCase
    ) { }

    /**
     * Cadastra um novo assinante.
     * POST /subscribers
     */
    async register(req: Request, res: Response) {
        const data = registerSubscriberSchema.parse(req.body);
        const output = await this.registerSubscriberUseCase.execute(data);

        return res.status(201).json(output);
    }

    /**
     * Lista assinantes com filtro opcional por bairro.
     * GET /subscribers
     */
    async list(req: Request, res: Response) {
        const neighborhoodId = req.query.neighborhoodId ? Number(req.query.neighborhoodId) : undefined;
        const output = await this.listSubscribersUseCase.execute(neighborhoodId);

        return res.status(200).json(output);
    }

    /**
     * Busca um assinante pelo ID.
     * GET /subscribers/:id
     */
    async findById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const output = await this.findSubscriberByIdUseCase.execute(id);

        return res.status(200).json(output);
    }

    /**
     * Atualiza dados de um assinante.
     * PUT /subscribers/:id
     */
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = updateSubscriberSchema.parse(req.body);

        const output = await this.updateSubscriberProfileUseCase.execute(id, data);

        return res.status(200).json(output);
    }

    /**
     * Remove um assinante.
     * DELETE /subscribers/:id
     */
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.unsubscribeUseCase.execute(id);

        return res.status(204).send();
    }
}
