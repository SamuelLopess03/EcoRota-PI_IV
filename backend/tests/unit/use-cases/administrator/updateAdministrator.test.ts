import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateAdministratorUseCase } from "../../../../src/application/use-cases/administrator/UpdateAdministratorUseCase.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { HashProvider } from "../../../../src/domain/providers/HashProvider.js";
import { makeAdministrator } from "../../../helpers/entityFactories.js";
import { makeEmail } from "../../../helpers/valueObjectFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { UpdateAdministratorInputDTO } from "../../../../src/application/dtos/administrator/UpdateAdministratorDTO.js";

describe("UseCase: UpdateAdministrator", () => {
    let useCase: UpdateAdministratorUseCase;
    let administratorRepo: jest.Mocked<AdministratorRepository>;
    let hashProvider: jest.Mocked<HashProvider>;

    beforeEach(() => {
        administratorRepo = {
            update: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        hashProvider = {
            generateHash: jest.fn(),
        } as unknown as jest.Mocked<HashProvider>;

        useCase = new UpdateAdministratorUseCase(administratorRepo, hashProvider);
    });

    it("deve atualizar o perfil completo do administrador", async () => {
        const id = 1;
        const input: UpdateAdministratorInputDTO = {
            name: "Updated Admin",
            email: "updated@test.com",
            password: "new-password"
        };

        const updatedAdmin = makeAdministrator({
            id,
            name: input.name,
            email: makeEmail(input.email),
            password: "new-hash"
        });

        hashProvider.generateHash.mockResolvedValue("new-hash");
        administratorRepo.update.mockResolvedValue(updatedAdmin);

        const result = await useCase.execute(id, input);

        expect(hashProvider.generateHash).toHaveBeenCalledWith(input.password!);
        expect(administratorRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            name: input.name,
            email: expect.any(Object),
            password: "new-hash"
        }));

        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
    });

    it("deve atualizar apenas campos parciais", async () => {
        const id = 1;
        const input: UpdateAdministratorInputDTO = {
            name: "Partial Name Update"
        };

        const updatedAdmin = makeAdministrator({ id, name: input.name });

        administratorRepo.update.mockResolvedValue(updatedAdmin);

        const result = await useCase.execute(id, input);

        expect(administratorRepo.update).toHaveBeenCalledWith(id, { name: input.name });
        expect(hashProvider.generateHash).not.toHaveBeenCalled();
        expect(result.name).toBe(input.name);
    });

    it("deve propagar erro EntityNotFoundError se o administrador não existir", async () => {
        const id = 999;
        administratorRepo.update.mockRejectedValue(new EntityNotFoundError("Administrador", id));

        await expect(useCase.execute(id, { name: "Test" })).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, { name: "Test" })).rejects.toThrow(`Administrador com identificador '${id}' não foi encontrado.`);
    });
});
