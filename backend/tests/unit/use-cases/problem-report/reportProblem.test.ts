import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ReportProblemUseCase } from "../../../../src/application/use-cases/problem-report/ReportProblemUseCase.js";
import { ProblemReportRepository } from "../../../../src/domain/repositories/ProblemReportRepository.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { makeProblemReport, makeSubscriber } from "../../../helpers/entityFactories.js";
import { makeProblemProtocol, makeProblemDescription } from "../../../helpers/valueObjectFactories.js";
import { ReportProblemInputDTO } from "../../../../src/application/dtos/problem-report/ReportProblemDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";

describe("UseCase: ReportProblem", () => {
    let useCase: ReportProblemUseCase;
    let problemReportRepo: jest.Mocked<ProblemReportRepository>;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        problemReportRepo = {
            create: jest.fn(),
            findAll: jest.fn(),
        } as unknown as jest.Mocked<ProblemReportRepository>;

        subscriberRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new ReportProblemUseCase(problemReportRepo, subscriberRepo);
    });

    it("deve registrar um novo problema com sucesso", async () => {
        const input: ReportProblemInputDTO = {
            description: "Vazamento de esgoto na rua principal",
            problemType: "Outros",
            attachments: ["http://link.com/foto.jpg"],
            subscriberId: 1
        };

        const mockedSubscriber = makeSubscriber({ id: 1 });
        const currentYear = new Date().getFullYear();
        const expectedProtocolValue = `PR-${currentYear}-0001`;
        
        const mockedReport = makeProblemReport({
            id: 100,
            subscriberId: 1,
            description: makeProblemDescription(input.description),
            protocol: makeProblemProtocol(expectedProtocolValue)
        });

        subscriberRepo.findById.mockResolvedValue(mockedSubscriber);
        problemReportRepo.findAll.mockResolvedValue([]);
        problemReportRepo.create.mockResolvedValue(mockedReport);

        const result = await useCase.execute(input);

        expect(subscriberRepo.findById).toHaveBeenCalledWith(input.subscriberId);
        expect(problemReportRepo.findAll).toHaveBeenCalled();
        expect(problemReportRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            description: expect.any(Object),
            problemType: expect.any(Object),
            attachments: expect.any(Object),
            subscriberId: input.subscriberId,
            status: expect.any(Object),
            protocol: expect.any(Object)
        }));

        expect(result.id).toBe(100);
        expect(result.subscriberId).toBe(1);
    });

    it("deve gerar protocolo sequencial baseado nos registros do ano", async () => {
        const input: ReportProblemInputDTO = {
            description: "Lixo acumulado na calçada",
            problemType: "Lixo espalhado",
            attachments: [],
            subscriberId: 1
        };

        const currentYear = new Date().getFullYear();
        const mockedReports = [
            makeProblemReport({ createdAt: new Date(`${currentYear}-06-01T12:00:00Z`) }),
            makeProblemReport({ createdAt: new Date(`${currentYear}-07-01T12:00:00Z`) }),
            makeProblemReport({ createdAt: new Date(`${currentYear - 1}-12-31T12:00:00Z`) }) // Ano anterior, deve ser ignorado
        ];

        subscriberRepo.findById.mockResolvedValue(makeSubscriber());
        problemReportRepo.findAll.mockResolvedValue(mockedReports);
        
        const expectedProtocol = `PR-${currentYear}-0003`;

        problemReportRepo.create.mockImplementation(async (data) => {
            return makeProblemReport({ ...data, id: 101 } as any);
        });

        const result = await useCase.execute(input);

        expect(subscriberRepo.findById).toHaveBeenCalledWith(input.subscriberId);
        expect(problemReportRepo.findAll).toHaveBeenCalled();
        expect(problemReportRepo.create).toHaveBeenCalledWith(expect.any(Object));

        expect(result.protocol).toBe(expectedProtocol);
    });

    it("deve propagar EntityNotFoundError se o assinante não existir", async () => {
        const input: ReportProblemInputDTO = {
            description: "Descrição válida com mais de dez caracteres",
            problemType: "Outros",
            attachments: [],
            subscriberId: 999
        };

        subscriberRepo.findById.mockRejectedValue(new EntityNotFoundError("Assinante", 999));

        await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(input)).rejects.toThrow("Assinante com identificador '999' não foi encontrado.");
        
        expect(problemReportRepo.create).not.toHaveBeenCalled();
    });

    it("deve propagar ConflictError se houver conflito na criação (ex: protocolo duplicado)", async () => {
        const input: ReportProblemInputDTO = {
            description: "Descrição de teste para conflito",
            problemType: "Outros",
            attachments: [],
            subscriberId: 1
        };

        subscriberRepo.findById.mockResolvedValue(makeSubscriber());
        problemReportRepo.findAll.mockResolvedValue([]);
        problemReportRepo.create.mockRejectedValue(new ConflictError("Protocolo já existe"));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("Protocolo já existe");
    });
});
