import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { DeleteAdministratorUseCase } from "../../../../src/application/use-cases/administrator/DeleteAdministratorUseCase.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: DeleteAdministrator", () => {
    let useCase: DeleteAdministratorUseCase;
    let administratorRepo: jest.Mocked<AdministratorRepository>;

    beforeEach(() => {
        administratorRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        useCase = new DeleteAdministratorUseCase(administratorRepo);
    });

    it("deve remover um administrador com sucesso", async () => {
        const id = 1;
        administratorRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(administratorRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro EntityNotFoundError se o administrador não existir", async () => {
        const id = 999;
        administratorRepo.delete.mockRejectedValue(new EntityNotFoundError("Administrador", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Administrador com identificador '${id}' não foi encontrado.`);
    });
});
