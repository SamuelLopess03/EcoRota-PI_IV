import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ResolveProblemUseCase } from "../../../../src/application/use-cases/problem-report/ResolveProblemUseCase.js";
import { ProblemReportRepository } from "../../../../src/domain/repositories/ProblemReportRepository.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { makeProblemReport, makeAdministrator } from "../../../helpers/entityFactories.js";
import { makeProblemStatus, makeProblemJustification } from "../../../helpers/valueObjectFactories.js";
import { ResolveProblemInputDTO } from "../../../../src/application/dtos/problem-report/ResolveProblemDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: ResolveProblem", () => {
    let useCase: ResolveProblemUseCase;
    let problemReportRepo: jest.Mocked<ProblemReportRepository>;
    let administratorRepo: jest.Mocked<AdministratorRepository>;

    beforeEach(() => {
        problemReportRepo = {
            updateStatus: jest.fn(),
        } as unknown as jest.Mocked<ProblemReportRepository>;

        administratorRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        useCase = new ResolveProblemUseCase(problemReportRepo, administratorRepo);
    });

    it("deve resolver um problema com sucesso (atualizar status)", async () => {
        const id = 100;
        const input: ResolveProblemInputDTO = {
            status: "RESOLVED",
            adminId: 1,
            justification: "Problema resolvido pela equipe técnica após vistoria local"
        };

        const updatedReport = makeProblemReport({
            id,
            status: makeProblemStatus(input.status),
            resolvedByAdminId: 1,
            justification: makeProblemJustification(input.justification!)
        });

        administratorRepo.findById.mockResolvedValue(makeAdministrator({ id: 1 }));
        problemReportRepo.updateStatus.mockResolvedValue(updatedReport);

        const result = await useCase.execute(id, input);

        expect(administratorRepo.findById).toHaveBeenCalledWith(input.adminId);
        expect(problemReportRepo.updateStatus).toHaveBeenCalledWith(
            id,
            expect.any(Object),
            input.adminId,
            expect.any(Object)
        );

        expect(result.status).toBe("RESOLVED");
        expect(result.resolvedByAdminId).toBe(1);
    });

    it("deve propagar EntityNotFoundError se o admin não existir", async () => {
        const id = 100;
        const input: ResolveProblemInputDTO = {
            status: "RESOLVED",
            adminId: 999
        };

        administratorRepo.findById.mockRejectedValue(new EntityNotFoundError("Administrador", 999));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, input)).rejects.toThrow("Administrador com identificador '999' não foi encontrado.");
        
        expect(problemReportRepo.updateStatus).not.toHaveBeenCalled();
    });

    it("deve propagar EntityNotFoundError se o relato não existir", async () => {
        const id = 999;
        const input: ResolveProblemInputDTO = {
            status: "RESOLVED",
            adminId: 1
        };

        administratorRepo.findById.mockResolvedValue(makeAdministrator());
        problemReportRepo.updateStatus.mockRejectedValue(new EntityNotFoundError("Relato", id));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, input)).rejects.toThrow(`Relato com identificador '${id}' não foi encontrado.`);

        expect(administratorRepo.findById).toHaveBeenCalledWith(input.adminId);
        expect(problemReportRepo.updateStatus).toHaveBeenCalled();
    });
});
