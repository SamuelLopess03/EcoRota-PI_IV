import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { DeleteEcopointUseCase } from "../../../../src/application/use-cases/ecopoint/DeleteEcopointUseCase.js";
import { EcopointRepository } from "../../../../src/domain/repositories/EcopointRepository.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: DeleteEcopoint", () => {
    let useCase: DeleteEcopointUseCase;
    let ecopointRepo: jest.Mocked<EcopointRepository>;

    beforeEach(() => {
        ecopointRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<EcopointRepository>;

        useCase = new DeleteEcopointUseCase(ecopointRepo);
    });

    it("deve remover um ecoponto com sucesso", async () => {
        const id = 1;
        ecopointRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(ecopointRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro EntityNotFoundError se o ecoponto não existir", async () => {
        const id = 999;
        ecopointRepo.delete.mockRejectedValue(new EntityNotFoundError("Ecoponto", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Ecoponto com identificador '${id}' não foi encontrado.`);
    });
});
