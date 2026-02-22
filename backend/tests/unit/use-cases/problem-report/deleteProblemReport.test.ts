import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { DeleteProblemReportUseCase } from "../../../../src/application/use-cases/problem-report/DeleteProblemReportUseCase.js";
import { ProblemReportRepository } from "../../../../src/domain/repositories/ProblemReportRepository.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: DeleteProblemReport", () => {
    let useCase: DeleteProblemReportUseCase;
    let problemReportRepo: jest.Mocked<ProblemReportRepository>;

    beforeEach(() => {
        problemReportRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<ProblemReportRepository>;

        useCase = new DeleteProblemReportUseCase(problemReportRepo);
    });

    it("deve remover um relato de problema com sucesso", async () => {
        const id = 100;
        problemReportRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(problemReportRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar EntityNotFoundError se o relato não existir", async () => {
        const id = 999;
        problemReportRepo.delete.mockRejectedValue(new EntityNotFoundError("Relato", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Relato com identificador '${id}' não foi encontrado.`);

        expect(problemReportRepo.delete).toHaveBeenCalledWith(id);
    });
});
