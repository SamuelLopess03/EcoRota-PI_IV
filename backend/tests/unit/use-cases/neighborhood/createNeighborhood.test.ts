import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateNeighborhoodUseCase } from "../../../../src/application/use-cases/neighborhood/CreateNeighborhoodUseCase.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { makeNeighborhood, makeRoute } from "../../../helpers/entityFactories.js";
import { CreateNeighborhoodInputDTO } from "../../../../src/application/dtos/neighborhood/CreateNeighborhoodDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";

describe("UseCase: CreateNeighborhood", () => {
    let useCase: CreateNeighborhoodUseCase;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        neighborhoodRepo = {
            create: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        routeRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        useCase = new CreateNeighborhoodUseCase(neighborhoodRepo, routeRepo);
    });

    it("deve criar um novo bairro com sucesso", async () => {
        const input: CreateNeighborhoodInputDTO = {
            name: "Bairro Central",
            populationEstimate: 5000,
            postalCode: "64000-000",
            latitude: -5.0,
            longitude: -42.8,
            routeId: 1,
            adminId: 1
        };

        const mockedRoute = makeRoute({ id: 1 });
        const mockedNeighborhood = makeNeighborhood({
            id: 10,
            name: input.name,
            routeId: input.routeId,
            adminIdCreated: input.adminId
        });

        routeRepo.findById.mockResolvedValue(mockedRoute);
        neighborhoodRepo.create.mockResolvedValue(mockedNeighborhood);

        const result = await useCase.execute(input);

        expect(routeRepo.findById).toHaveBeenCalledWith(input.routeId);
        expect(neighborhoodRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            name: input.name,
            postalCode: expect.any(Object),
            populationEstimate: expect.any(Object),
            geoLocation: expect.any(Object),
            routeId: input.routeId,
            adminIdCreated: input.adminId
        }));

        expect(result.id).toBe(10);
        expect(result.name).toBe(input.name);
        expect(result.postalCode).toBe("64000000");
    });

    it("deve propagar EntityNotFoundError se a rota informada não existir", async () => {
        const input: CreateNeighborhoodInputDTO = {
            name: "Bairro Sem Rota",
            populationEstimate: 100,
            postalCode: "64000-000",
            latitude: 0,
            longitude: 0,
            routeId: 999,
            adminId: 1
        };

        routeRepo.findById.mockRejectedValue(new EntityNotFoundError("Rota", 999));

        await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(input)).rejects.toThrow("Rota com identificador '999' não foi encontrado.");
        
        expect(routeRepo.findById).toHaveBeenCalledWith(input.routeId);
        expect(neighborhoodRepo.create).not.toHaveBeenCalled();
    });

    it("deve propagar ConflictError se houver conflito de nome ou localização", async () => {
        const input: CreateNeighborhoodInputDTO = {
            name: "Bairro Conflitante",
            populationEstimate: 100,
            postalCode: "64000-000",
            latitude: 0,
            longitude: 0,
            routeId: 1,
            adminId: 1
        };

        routeRepo.findById.mockResolvedValue(makeRoute());
        neighborhoodRepo.create.mockRejectedValue(new ConflictError("Bairro com nome ou localização conflitante já existe."));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("Bairro com nome ou localização conflitante já existe.");

        expect(routeRepo.findById).toHaveBeenCalledWith(input.routeId);
        expect(neighborhoodRepo.create).toHaveBeenCalled();
    });
});
