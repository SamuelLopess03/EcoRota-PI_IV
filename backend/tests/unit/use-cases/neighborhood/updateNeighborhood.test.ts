import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateNeighborhoodUseCase } from "../../../../src/application/use-cases/neighborhood/UpdateNeighborhoodUseCase.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { makeNeighborhood, makeRoute } from "../../../helpers/entityFactories.js";
import { UpdateNeighborhoodInputDTO } from "../../../../src/application/dtos/neighborhood/UpdateNeighborhoodDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: UpdateNeighborhood", () => {
    let useCase: UpdateNeighborhoodUseCase;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        neighborhoodRepo = {
            update: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        routeRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        useCase = new UpdateNeighborhoodUseCase(neighborhoodRepo, routeRepo);
    });

    it("deve atualizar os dados completos do bairro", async () => {
        const id = 10;
        const input: UpdateNeighborhoodInputDTO = {
            name: "Novo Nome",
            populationEstimate: 8000,
            postalCode: "64000-001",
            latitude: -5.1,
            longitude: -42.9,
            routeId: 2,
            adminId: 1
        };

        const mockedRoute = makeRoute({ id: 2 });
        const updatedNeighborhood = makeNeighborhood({ 
            id, 
            name: input.name, 
            routeId: input.routeId,
            adminIdUpdated: input.adminId
        });

        routeRepo.findById.mockResolvedValue(mockedRoute);
        neighborhoodRepo.update.mockResolvedValue(updatedNeighborhood);

        const result = await useCase.execute(id, input);

        expect(routeRepo.findById).toHaveBeenCalledWith(input.routeId!);
        expect(neighborhoodRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            name: input.name,
            routeId: input.routeId,
            adminIdUpdated: input.adminId
        }));
        expect(result.name).toBe(input.name);
        expect(result.routeId).toBe(input.routeId);
    });

    it("deve atualizar apenas campos parciais", async () => {
        const id = 10;
        const input: UpdateNeighborhoodInputDTO = {
            name: "Nome Alterado",
            adminId: 1
        };

        const updatedNeighborhood = makeNeighborhood({ id, name: input.name, adminIdUpdated: input.adminId });

        neighborhoodRepo.update.mockResolvedValue(updatedNeighborhood);

        const result = await useCase.execute(id, input);

        expect(neighborhoodRepo.update).toHaveBeenCalledWith(id, {
            name: input.name,
            adminIdUpdated: input.adminId
        });
        expect(routeRepo.findById).not.toHaveBeenCalled();
        expect(result.name).toBe(input.name);
    });

    it("deve propagar EntityNotFoundError se a nova rota informada não existir", async () => {
        const id = 10;
        const input: UpdateNeighborhoodInputDTO = {
            routeId: 999,
            adminId: 1
        };

        routeRepo.findById.mockRejectedValue(new EntityNotFoundError("Rota", 999));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, input)).rejects.toThrow("Rota com identificador '999' não foi encontrado.");
        
        expect(routeRepo.findById).toHaveBeenCalledWith(input.routeId!);
        expect(neighborhoodRepo.update).not.toHaveBeenCalled();
    });

    it("deve propagar EntityNotFoundError se o bairro não existir para atualização", async () => {
        const id = 999;
        neighborhoodRepo.update.mockRejectedValue(new EntityNotFoundError("Bairro", id));

        await expect(useCase.execute(id, { name: "Test", adminId: 1 })).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, { name: "Test", adminId: 1 })).rejects.toThrow(`Bairro com identificador '${id}' não foi encontrado.`);

        expect(routeRepo.findById).not.toHaveBeenCalled();
        expect(neighborhoodRepo.update).toHaveBeenCalled();
    });
});
