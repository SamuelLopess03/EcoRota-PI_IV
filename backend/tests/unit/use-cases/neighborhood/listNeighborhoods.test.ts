import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListNeighborhoodsUseCase } from "../../../../src/application/use-cases/neighborhood/ListNeighborhoodsUseCase.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeNeighborhood } from "../../../helpers/entityFactories.js";

describe("UseCase: ListNeighborhoods", () => {
    let useCase: ListNeighborhoodsUseCase;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        neighborhoodRepo = {
            findAll: jest.fn(),
            findByRouteId: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new ListNeighborhoodsUseCase(neighborhoodRepo);
    });

    it("deve listar todos os bairros com sucesso", async () => {
        const mockedNeighborhoods = [
            makeNeighborhood({ id: 1 }),
            makeNeighborhood({ id: 2 })
        ];

        neighborhoodRepo.findAll.mockResolvedValue(mockedNeighborhoods);

        const result = await useCase.execute();

        expect(neighborhoodRepo.findAll).toHaveBeenCalled();
        expect(neighborhoodRepo.findByRouteId).not.toHaveBeenCalled();

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    });

    it("deve listar bairros filtrados por rota", async () => {
        const routeId = 1;
        const mockedNeighborhoods = [
            makeNeighborhood({ id: 1, routeId })
        ];

        neighborhoodRepo.findByRouteId.mockResolvedValue(mockedNeighborhoods);

        const result = await useCase.execute(routeId);

        expect(neighborhoodRepo.findByRouteId).toHaveBeenCalledWith(routeId);
        expect(neighborhoodRepo.findAll).not.toHaveBeenCalled();

        expect(result).toHaveLength(1);
        expect(result[0].routeId).toBe(routeId);
    });

    it("deve retornar lista vazia se nenhum bairro for encontrado", async () => {
        neighborhoodRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(neighborhoodRepo.findByRouteId).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});
