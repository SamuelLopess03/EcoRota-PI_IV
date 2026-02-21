import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { FindRouteByIdUseCase } from "../../../../src/application/use-cases/route/FindRouteByIdUseCase.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeRoute, makeNeighborhood } from "../../../helpers/entityFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: FindRouteById", () => {
    let useCase: FindRouteByIdUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        routeRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        neighborhoodRepo = {
            findByRouteId: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new FindRouteByIdUseCase(routeRepo, neighborhoodRepo);
    });

    it("deve retornar uma rota pelo ID com seus bairros", async () => {
        const id = 5;
        const mockedRoute = makeRoute({ id });
        const mockedNeighborhoods = [
            makeNeighborhood({ id: 10, name: "Bairro A", routeId: id }),
            makeNeighborhood({ id: 20, name: "Bairro B", routeId: id })
        ];

        routeRepo.findById.mockResolvedValue(mockedRoute);
        neighborhoodRepo.findByRouteId.mockResolvedValue(mockedNeighborhoods);

        const result = await useCase.execute(id);

        expect(routeRepo.findById).toHaveBeenCalledWith(id);
        expect(neighborhoodRepo.findByRouteId).toHaveBeenCalledWith(id);

        expect(result.id).toBe(id);
        expect(result.name).toBe(mockedRoute.name);
        expect(result.neighborhoods).toHaveLength(2);
        expect(result.neighborhoods[0].name).toBe("Bairro A");
        expect(result.neighborhoods[1].name).toBe("Bairro B");
    });

    it("deve propagar erro EntityNotFoundError se a rota não existir", async () => {
        const id = 999;
        routeRepo.findById.mockRejectedValue(new EntityNotFoundError("Rota", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Rota com identificador '${id}' não foi encontrado.`);
    });
});
