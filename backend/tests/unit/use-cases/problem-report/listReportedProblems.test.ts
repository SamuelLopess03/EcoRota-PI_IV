import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListReportedProblemsUseCase } from "../../../../src/application/use-cases/problem-report/ListReportedProblemsUseCase.js";
import { ProblemReportRepository } from "../../../../src/domain/repositories/ProblemReportRepository.js";
import { makeProblemReport } from "../../../helpers/entityFactories.js";
import { makeProblemProtocol, makeProblemStatus } from "../../../helpers/valueObjectFactories.js";

describe("UseCase: ListReportedProblems", () => {
    let useCase: ListReportedProblemsUseCase;
    let problemReportRepo: jest.Mocked<ProblemReportRepository>;

    beforeEach(() => {
        problemReportRepo = {
            findAll: jest.fn(),
            findByProtocol: jest.fn(),
            findBySubscriberId: jest.fn(),
        } as unknown as jest.Mocked<ProblemReportRepository>;

        useCase = new ListReportedProblemsUseCase(problemReportRepo);
    });

    it("deve listar todos os problemas com sucesso", async () => {
        const mockedReports = [
            makeProblemReport({ id: 1 }),
            makeProblemReport({ id: 2 })
        ];

        problemReportRepo.findAll.mockResolvedValue(mockedReports);

        const result = await useCase.execute();

        expect(problemReportRepo.findAll).toHaveBeenCalled();
        expect(problemReportRepo.findByProtocol).not.toHaveBeenCalled();
        expect(problemReportRepo.findBySubscriberId).not.toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });

    it("deve filtrar problemas por protocolo", async () => {
        const protocol = "PR-2024-0001";
        const mockedReport = makeProblemReport({ id: 1, protocol: makeProblemProtocol(protocol) });

        problemReportRepo.findByProtocol.mockResolvedValue(mockedReport);

        const result = await useCase.execute({ protocol });

        expect(problemReportRepo.findByProtocol).toHaveBeenCalledWith(expect.any(Object));
        expect(problemReportRepo.findBySubscriberId).not.toHaveBeenCalled();
        expect(problemReportRepo.findAll).not.toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].protocol).toBe(protocol);
    });

    it("deve filtrar problemas por assinante", async () => {
        const subscriberId = 5;
        const mockedReports = [
            makeProblemReport({ id: 1, subscriberId })
        ];

        problemReportRepo.findBySubscriberId.mockResolvedValue(mockedReports);

        const result = await useCase.execute({ subscriberId });

        expect(problemReportRepo.findBySubscriberId).toHaveBeenCalledWith(subscriberId);
        expect(problemReportRepo.findByProtocol).not.toHaveBeenCalled();
        expect(problemReportRepo.findAll).not.toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].subscriberId).toBe(subscriberId);
    });

    it("deve filtrar problemas por status", async () => {
        const status = "RESOLVED";
        const mockedReports = [
            makeProblemReport({ id: 1, status: makeProblemStatus("PENDING") }),
            makeProblemReport({ id: 2, status: makeProblemStatus("RESOLVED") })
        ];

        problemReportRepo.findAll.mockResolvedValue(mockedReports);

        const result = await useCase.execute({ status });

        expect(problemReportRepo.findAll).toHaveBeenCalled();
        expect(problemReportRepo.findByProtocol).not.toHaveBeenCalled();
        expect(problemReportRepo.findBySubscriberId).not.toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("RESOLVED");
    });

    it("deve retornar lista vazia se nenhum problema for encontrado", async () => {
        problemReportRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(problemReportRepo.findByProtocol).not.toHaveBeenCalled();
        expect(problemReportRepo.findBySubscriberId).not.toHaveBeenCalled();

        expect(result).toEqual([]);
    });

    it("deve retornar lista vazia se protocolo não for encontrado", async () => {
        problemReportRepo.findByProtocol.mockResolvedValue(null);

        const result = await useCase.execute({ protocol: "PR-9999-0001" });

        expect(problemReportRepo.findAll).not.toHaveBeenCalled();
        expect(problemReportRepo.findBySubscriberId).not.toHaveBeenCalled();

        expect(result).toEqual([]);
    });

    it("deve retornar lista vazia se assinante não for encontrado", async () => {
        problemReportRepo.findBySubscriberId.mockResolvedValue([]);

        const result = await useCase.execute({ subscriberId: 5 });

        expect(problemReportRepo.findAll).not.toHaveBeenCalled();
        expect(problemReportRepo.findByProtocol).not.toHaveBeenCalled();

        expect(result).toEqual([]);
    });
});
