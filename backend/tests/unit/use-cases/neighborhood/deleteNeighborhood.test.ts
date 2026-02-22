import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { DeleteNeighborhoodUseCase } from "../../../../src/application/use-cases/neighborhood/DeleteNeighborhoodUseCase.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { DependencyError } from "../../../../src/domain/errors/persistence/DependencyError.js";

describe("UseCase: DeleteNeighborhood", () => {
    let useCase: DeleteNeighborhoodUseCase;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        neighborhoodRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new DeleteNeighborhoodUseCase(neighborhoodRepo);
    });

    it("deve remover um bairro com sucesso", async () => {
        const id = 10;
        neighborhoodRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(neighborhoodRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar EntityNotFoundError se o bairro não existir", async () => {
        const id = 999;
        neighborhoodRepo.delete.mockRejectedValue(new EntityNotFoundError("Bairro", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Bairro com identificador '${id}' não foi encontrado.`);

        expect(neighborhoodRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar DependencyError se o bairro tiver vínculos ativos", async () => {
        const id = 10;
        neighborhoodRepo.delete.mockRejectedValue(new DependencyError("Não é possível excluir este bairro pois existem ecopontos ou inscritos vinculados a ele."));

        await expect(useCase.execute(id)).rejects.toThrow(DependencyError);
        await expect(useCase.execute(id)).rejects.toThrow("Não é possível excluir este bairro pois existem ecopontos ou inscritos vinculados a ele.");

        expect(neighborhoodRepo.delete).toHaveBeenCalledWith(id);
    });
});
