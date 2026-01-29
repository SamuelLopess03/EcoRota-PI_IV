import { Request, Response } from "express";
import { z } from "zod";
import { ReportProblemUseCase } from "../../application/use-cases/problem-report/ReportProblemUseCase.js";
import { ListReportedProblemsUseCase } from "../../application/use-cases/problem-report/ListReportedProblemsUseCase.js";
import { ResolveProblemUseCase } from "../../application/use-cases/problem-report/ResolveProblemUseCase.js";
import { UpdateProblemReportUseCase } from "../../application/use-cases/problem-report/UpdateProblemReportUseCase.js";
import { DeleteProblemReportUseCase } from "../../application/use-cases/problem-report/DeleteProblemReportUseCase.js";
import { AuthenticatedRequest } from "../../infrastructure/http/middlewares/EnsureAuthenticated.js";

const reportProblemSchema = z.object({
    description: z.string().min(10).max(1000),
    problemType: z.string().min(3).max(50),
    attachments: z.array(z.string()).optional(),
    subscriberId: z.number().int().positive(),
});

const resolveProblemSchema = z.object({
    status: z.string().min(3).max(20),
    justification: z.string().min(10).max(500).optional(),
});

const updateProblemReportSchema = z.object({
    description: z.string().min(10).max(1000).optional(),
    problemType: z.string().min(3).max(50).optional(),
    attachments: z.array(z.string()).optional(),
    subscriberId: z.number().int().positive().optional(),
});

/**
 * @class ProblemReportController
 * @description Adaptador de entrada para gestão de relatos de problemas.
 */
export class ProblemReportController {
    constructor(
        private reportProblemUseCase: ReportProblemUseCase,
        private listReportedProblemsUseCase: ListReportedProblemsUseCase,
        private resolveProblemUseCase: ResolveProblemUseCase,
        private updateProblemReportUseCase: UpdateProblemReportUseCase,
        private deleteProblemReportUseCase: DeleteProblemReportUseCase
    ) { }

    /**
     * Reporta um novo problema.
     * POST /problem-reports
     */
    async report(req: Request, res: Response) {
        const data = reportProblemSchema.parse(req.body);

        const output = await this.reportProblemUseCase.execute({
            ...data,
            attachments: data.attachments || []
        });

        return res.status(201).json(output);
    }

    /**
     * Lista os problemas reportados com filtros.
     * GET /problem-reports
     */
    async list(req: Request, res: Response) {
        const filters = {
            protocol: req.query.protocol ? String(req.query.protocol) : undefined,
            status: req.query.status ? String(req.query.status) : undefined,
            subscriberId: req.query.subscriberId ? Number(req.query.subscriberId) : undefined,
        };

        const output = await this.listReportedProblemsUseCase.execute(filters);
        return res.status(200).json(output);
    }

    /**
     * Resolve um problema reportado.
     * PATCH /problem-reports/:id/resolve
     */
    async resolve(req: Request, res: Response) {
        const id = Number(req.params.id);
        const body = resolveProblemSchema.parse(req.body);
        const { id: adminId } = (req as AuthenticatedRequest).administrator;

        const output = await this.resolveProblemUseCase.execute(id, {
            status: body.status,
            justification: body.justification,
            adminId,
        });

        return res.status(200).json(output);
    }

    /**
     * Atualiza um relato de problema.
     * PUT /problem-reports/:id
     */
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = updateProblemReportSchema.parse(req.body);

        const output = await this.updateProblemReportUseCase.execute(id, data);

        return res.status(200).json(output);
    }

    /**
     * Deleta um relato de problema.
     * DELETE /problem-reports/:id
     */
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.deleteProblemReportUseCase.execute(id);

        return res.status(204).send();
    }
}
