import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { FindNeighborhoodByIdUseCase } from "../../../../src/application/use-cases/neighborhood/FindNeighborhoodByIdUseCase.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeNeighborhood } from "../../../helpers/entityFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: FindNeighborhoodById", () => {
    let useCase: FindNeighborhoodByIdUseCase;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        neighborhoodRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new FindNeighborhoodByIdUseCase(neighborhoodRepo);
    });

    it("deve retornar um bairro pelo ID com sucesso", async () => {
        const id = 10;
        const mockedNeighborhood = makeNeighborhood({ id, name: "Bairro Centro" });

        neighborhoodRepo.findById.mockResolvedValue(mockedNeighborhood);

        const result = await useCase.execute(id);

        expect(neighborhoodRepo.findById).toHaveBeenCalledWith(id);
        expect(result.id).toBe(id);
        expect(result.name).toBe("Bairro Centro");
        expect(result.postalCodeFormatted).toBeDefined();
    });

    it("deve propagar EntityNotFoundError se o bairro não existir", async () => {
        const id = 999;
        neighborhoodRepo.findById.mockRejectedValue(new EntityNotFoundError("Bairro", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Bairro com identificador '${id}' não foi encontrado.`);

        expect(neighborhoodRepo.findById).toHaveBeenCalledWith(id);
    });
});
