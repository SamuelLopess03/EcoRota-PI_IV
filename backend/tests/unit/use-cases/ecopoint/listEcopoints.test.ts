import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListEcopointsUseCase } from "../../../../src/application/use-cases/ecopoint/ListEcopointsUseCase.js";
import { EcopointRepository } from "../../../../src/domain/repositories/EcopointRepository.js";
import { makeEcopoint } from "../../../helpers/entityFactories.js";

describe("UseCase: ListEcopoints", () => {
    let useCase: ListEcopointsUseCase;
    let ecopointRepo: jest.Mocked<EcopointRepository>;

    beforeEach(() => {
        ecopointRepo = {
            findAll: jest.fn(),
            findByNeighborhoodId: jest.fn(),
        } as unknown as jest.Mocked<EcopointRepository>;

        useCase = new ListEcopointsUseCase(ecopointRepo);
    });

    it("deve listar todos os ecopontos com sucesso", async () => {
        const mockedEcopoints = [
            makeEcopoint({ id: 1, name: "Ecoponto 1" }),
            makeEcopoint({ id: 2, name: "Ecoponto 2" })
        ];

        ecopointRepo.findAll.mockResolvedValue(mockedEcopoints);

        const result = await useCase.execute();

        expect(ecopointRepo.findAll).toHaveBeenCalled();
        expect(ecopointRepo.findByNeighborhoodId).not.toHaveBeenCalled();

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    });

    it("deve listar ecopontos filtrados por bairro", async () => {
        const neighborhoodId = 10;
        const mockedEcopoints = [
            makeEcopoint({ id: 1, neighborhoodId })
        ];

        ecopointRepo.findByNeighborhoodId.mockResolvedValue(mockedEcopoints);

        const result = await useCase.execute(neighborhoodId);

        expect(ecopointRepo.findByNeighborhoodId).toHaveBeenCalledWith(neighborhoodId);
        expect(ecopointRepo.findAll).not.toHaveBeenCalled();

        expect(result).toHaveLength(1);
        expect(result[0].neighborhoodId).toBe(neighborhoodId);
    });

    it("deve retornar lista vazia se nenhum ecoponto for encontrado", async () => {
        ecopointRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(ecopointRepo.findByNeighborhoodId).not.toHaveBeenCalled();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
