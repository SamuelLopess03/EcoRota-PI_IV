import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateProblemReportUseCase } from "../../../../src/application/use-cases/problem-report/UpdateProblemReportUseCase.js";
import { ProblemReportRepository } from "../../../../src/domain/repositories/ProblemReportRepository.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { makeProblemReport, makeSubscriber } from "../../../helpers/entityFactories.js";
import { makeProblemDescription } from "../../../helpers/valueObjectFactories.js";
import { UpdateProblemReportInputDTO } from "../../../../src/application/dtos/problem-report/UpdateProblemReportDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: UpdateProblemReport", () => {
    let useCase: UpdateProblemReportUseCase;
    let problemReportRepo: jest.Mocked<ProblemReportRepository>;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        problemReportRepo = {
            update: jest.fn(),
        } as unknown as jest.Mocked<ProblemReportRepository>;

        subscriberRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new UpdateProblemReportUseCase(problemReportRepo, subscriberRepo);
    });

    it("deve atualizar os dados completos do relato", async () => {
        const id = 100;
        const input: UpdateProblemReportInputDTO = {
            description: "Nova descrição detalhada do problema",
            problemType: "Coleta não realizada",
            attachments: ["http://novo.link"],
            subscriberId: 2,
            justification: "Correção de dados necessária"
        };

        const updatedReport = makeProblemReport({
            id,
            description: makeProblemDescription(input.description!),
            subscriberId: input.subscriberId
        });

        subscriberRepo.findById.mockResolvedValue(makeSubscriber({ id: 2 }));
        problemReportRepo.update.mockResolvedValue(updatedReport);

        const result = await useCase.execute(id, input);

        expect(subscriberRepo.findById).toHaveBeenCalledWith(input.subscriberId!);
        expect(problemReportRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            description: expect.any(Object),
            problemType: expect.any(Object),
            attachments: expect.any(Object),
            subscriberId: input.subscriberId,
            justification: expect.any(Object)
        }));

        expect(result.id).toBe(id);
    });

    it("deve atualizar apenas campos parciais", async () => {
        const id = 100;
        const input: UpdateProblemReportInputDTO = {
            description: "Apenas descrição alterada"
        };

        const updatedReport = makeProblemReport({ id, description: makeProblemDescription(input.description!) });
        problemReportRepo.update.mockResolvedValue(updatedReport);

        const result = await useCase.execute(id, input);

        expect(subscriberRepo.findById).not.toHaveBeenCalled();
        expect(problemReportRepo.update).toHaveBeenCalledWith(id, {
            description: expect.any(Object)
        });
        expect(result.id).toBe(id);
    });

    it("deve propagar EntityNotFoundError se o relato não existir", async () => {
        const id = 999;
        problemReportRepo.update.mockRejectedValue(new EntityNotFoundError("Relato", id));

        await expect(useCase.execute(id, { description: "Descrição válida" })).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, { description: "Descrição válida" })).rejects.toThrow(`Relato com identificador '${id}' não foi encontrado.`);
    
        expect(subscriberRepo.findById).not.toHaveBeenCalled();
    });

    it("deve propagar EntityNotFoundError se o novo assinante não existir", async () => {
        const id = 100;
        const input: UpdateProblemReportInputDTO = { subscriberId: 999 };

        subscriberRepo.findById.mockRejectedValue(new EntityNotFoundError("Assinante", 999));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, input)).rejects.toThrow("Assinante com identificador '999' não foi encontrado.");
        
        expect(problemReportRepo.update).not.toHaveBeenCalled();
    });
});
