import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateEcopointUseCase } from "../../../../src/application/use-cases/ecopoint/CreateEcopointUseCase.js";
import { EcopointRepository } from "../../../../src/domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeEcopoint, makeNeighborhood } from "../../../helpers/entityFactories.js";
import { CreateEcopointInputDTO } from "../../../../src/application/dtos/ecopoint/CreateEcopointDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";

describe("UseCase: CreateEcopoint", () => {
    let useCase: CreateEcopointUseCase;
    let ecopointRepo: jest.Mocked<EcopointRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        ecopointRepo = {
            create: jest.fn(),
        } as unknown as jest.Mocked<EcopointRepository>;

        neighborhoodRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new CreateEcopointUseCase(ecopointRepo, neighborhoodRepo);
    });

    it("deve criar um novo ecoponto com sucesso", async () => {
        const input: CreateEcopointInputDTO = {
            name: "Ecoponto Estelar",
            partnerName: "Empresa Parceira",
            materials: ["plastic", "paper"],
            latitude: -5.089,
            longitude: -42.801,
            collectionDays: ["monday", "friday"],
            startTime: "08:00",
            endTime: "18:00",
            neighborhoodId: 10,
            adminId: 1
        };

        const mockedNeighborhood = makeNeighborhood({ id: 10 });
        const mockedEcopoint = makeEcopoint({
            id: 1,
            name: input.name,
            partnerName: input.partnerName,
            neighborhoodId: input.neighborhoodId,
            adminIdCreated: input.adminId
        });

        neighborhoodRepo.findById.mockResolvedValue(mockedNeighborhood);
        ecopointRepo.create.mockResolvedValue(mockedEcopoint);

        const result = await useCase.execute(input);

        expect(neighborhoodRepo.findById).toHaveBeenCalledWith(input.neighborhoodId);
        expect(ecopointRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            name: input.name,
            partnerName: input.partnerName,
            acceptedMaterials: expect.any(Object),
            geoLocation: expect.any(Object),
            collectionDays: expect.any(Object),
            collectionTime: expect.any(Object),
            neighborhoodId: input.neighborhoodId,
            adminIdCreated: input.adminId
        }));

        expect(result.id).toBe(mockedEcopoint.id);
        expect(result.name).toBe(input.name);
        expect(result.partnerName).toBe(input.partnerName);
        expect(result.neighborhoodId).toBe(input.neighborhoodId);
    });

    it("deve propagar EntityNotFoundError se o bairro informado não existir", async () => {
        const input: CreateEcopointInputDTO = {
            name: "Ecoponto Falho",
            materials: ["paper"],
            latitude: 0,
            longitude: 0,
            collectionDays: ["monday"],
            startTime: "08:00",
            endTime: "12:00",
            neighborhoodId: 999,
            adminId: 1
        };

        neighborhoodRepo.findById.mockRejectedValue(new EntityNotFoundError("Bairro", 999));

        await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(input)).rejects.toThrow("Bairro com identificador '999' não foi encontrado.");
        
        expect(ecopointRepo.create).not.toHaveBeenCalled();
    });

    it("deve propagar ConflictError se o ecoponto já existir", async () => {
        const input: CreateEcopointInputDTO = {
            name: "Ecoponto Duplicado",
            materials: ["paper"],
            latitude: 0,
            longitude: 0,
            collectionDays: ["monday"],
            startTime: "08:00",
            endTime: "12:00",
            neighborhoodId: 10,
            adminId: 1
        };

        neighborhoodRepo.findById.mockResolvedValue(makeNeighborhood());
        ecopointRepo.create.mockRejectedValue(new ConflictError("Ecoponto com este nome já existe."));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("Ecoponto com este nome já existe.");
    });
});
