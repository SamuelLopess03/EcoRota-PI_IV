import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateEcopointUseCase } from "../../../../src/application/use-cases/ecopoint/UpdateEcopointUseCase.js";
import { EcopointRepository } from "../../../../src/domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeEcopoint, makeNeighborhood } from "../../../helpers/entityFactories.js";
import { UpdateEcopointInputDTO } from "../../../../src/application/dtos/ecopoint/UpdateEcopointDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { makeCollectionDays, makeCollectionTime, makeGeoLocation, makeAcceptedMaterials } from "../../../helpers/valueObjectFactories.js";
import { WeekDay } from "../../../../src/domain/value-objects/WeekDay.js";
import { MaterialType } from "../../../../src/domain/value-objects/MaterialType.js";

describe("UseCase: UpdateEcopoint", () => {
    let useCase: UpdateEcopointUseCase;
    let ecopointRepo: jest.Mocked<EcopointRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        ecopointRepo = {
            findById: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<EcopointRepository>;

        neighborhoodRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new UpdateEcopointUseCase(ecopointRepo, neighborhoodRepo);
    });

    it("deve atualizar os dados completos do ecoponto", async () => {
        const id = 1;
        const input: UpdateEcopointInputDTO = {
            name: "Ecoponto Renovado",
            partnerName: "Novo Parceiro",
            materials: ["paper"],
            latitude: -5.0,
            longitude: -42.0,
            collectionDays: ["monday"],
            startTime: "09:00",
            endTime: "17:00",
            neighborhoodId: 20,
            adminId: 2
        };

        const currentEcopoint = makeEcopoint({ id });
        const updatedEcopoint = makeEcopoint({
            id,
            name: input.name,
            partnerName: input.partnerName,
            acceptedMaterials: makeAcceptedMaterials(input.materials as MaterialType[]),
            geoLocation: makeGeoLocation(input.latitude, input.longitude),
            collectionDays: makeCollectionDays(input.collectionDays as WeekDay[]),
            collectionTime: makeCollectionTime(input.startTime!, input.endTime!),
            neighborhoodId: input.neighborhoodId,
            adminIdUpdated: input.adminId
        });

        ecopointRepo.findById.mockResolvedValue(currentEcopoint);
        neighborhoodRepo.findById.mockResolvedValue(makeNeighborhood({ id: 20 }));
        ecopointRepo.update.mockResolvedValue(updatedEcopoint);

        const result = await useCase.execute(id, input);

        expect(ecopointRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            name: input.name,
            partnerName: input.partnerName,
            neighborhoodId: input.neighborhoodId,
            adminIdUpdated: input.adminId
        }));
        expect(result.name).toBe(input.name);
        expect(result.neighborhoodId).toBe(20);
    });

    it("deve atualizar apenas campos parciais", async () => {
        const id = 1;
        const input: UpdateEcopointInputDTO = {
            name: "Nome Parcial",
            adminId: 2
        };

        const currentEcopoint = makeEcopoint({ id });
        const updatedEcopoint = makeEcopoint({ id, name: input.name, adminIdUpdated: input.adminId });

        ecopointRepo.findById.mockResolvedValue(currentEcopoint);
        ecopointRepo.update.mockResolvedValue(updatedEcopoint);

        const result = await useCase.execute(id, input);

        expect(ecopointRepo.update).toHaveBeenCalledWith(id, {
            name: input.name,
            adminIdUpdated: input.adminId
        });
        expect(neighborhoodRepo.findById).not.toHaveBeenCalled();

        expect(result.name).toBe(input.name);
    });

    it("deve propagar erro EntityNotFoundError se o ecoponto não existir", async () => {
        const id = 999;
        ecopointRepo.findById.mockRejectedValue(new EntityNotFoundError("Ecoponto", id));

        await expect(useCase.execute(id, { name: "Test", adminId: 1 })).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, { name: "Test", adminId: 1 })).rejects.toThrow(`Ecoponto com identificador '${id}' não foi encontrado.`);

        expect(ecopointRepo.update).not.toHaveBeenCalled();
        expect(neighborhoodRepo.findById).not.toHaveBeenCalled();
    });

    it("deve propagar erro EntityNotFoundError se o novo bairro informado não existir", async () => {
        const id = 1;
        const input: UpdateEcopointInputDTO = {
            neighborhoodId: 999,
            adminId: 1
        };

        ecopointRepo.findById.mockResolvedValue(makeEcopoint({ id }));
        neighborhoodRepo.findById.mockRejectedValue(new EntityNotFoundError("Bairro", 999));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, input)).rejects.toThrow("Bairro com identificador '999' não foi encontrado.");

        expect(ecopointRepo.update).not.toHaveBeenCalled();
    });
});
