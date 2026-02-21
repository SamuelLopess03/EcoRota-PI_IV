import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { DeleteRouteUseCase } from "../../../../src/application/use-cases/route/DeleteRouteUseCase.js";

import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";

import { makeNeighborhood } from "../../../helpers/entityFactories.js";

import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: DeleteRoute", () => {
    let useCase: DeleteRouteUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        routeRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>; 

        neighborhoodRepo = {
            findByRouteId: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new DeleteRouteUseCase(routeRepo, neighborhoodRepo);
    });

    it("deve deletar a rota que não possui bairros vinculados", async () => {
        const id = 1;

        neighborhoodRepo.findByRouteId.mockResolvedValue([]);
        routeRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(neighborhoodRepo.findByRouteId).toHaveBeenCalledWith(id);
        expect(routeRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro ConflictError se a rota tiver bairros vinculados", async () => {
        const id = 1;

        const mockedNeigh = makeNeighborhood({ routeId: id });

        neighborhoodRepo.findByRouteId.mockResolvedValue([mockedNeigh]);

        await expect(useCase.execute(id)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(id)).rejects.toThrow(`Não é possível deletar a rota ${id} pois ela possui bairros vinculados.`);

        expect(neighborhoodRepo.findByRouteId).toHaveBeenCalledWith(id);
        expect(routeRepo.delete).not.toHaveBeenCalled();
    });

    it("deve propagar erro EntityNotFoundError se a rota não existir para deletar", async () => {
        const id = 1;

        neighborhoodRepo.findByRouteId.mockResolvedValue([]);
        routeRepo.delete.mockRejectedValue(new EntityNotFoundError("Rota", id))

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Rota com identificador '${id}' não foi encontrado.`);

        expect(neighborhoodRepo.findByRouteId).toHaveBeenCalledWith(id);
        expect(routeRepo.delete).toHaveBeenCalledWith(id);
    });
})