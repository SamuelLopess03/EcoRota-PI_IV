import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateAdministratorUseCase } from "../../../../src/application/use-cases/administrator/CreateAdministratorUseCase.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { HashProvider } from "../../../../src/domain/providers/HashProvider.js";
import { makeAdministrator } from "../../../helpers/entityFactories.js";
import { makeEmail } from "../../../helpers/valueObjectFactories.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";
import { CreateAdministratorInputDTO } from "../../../../src/application/dtos/administrator/CreateAdministratorDTO.js";

describe("UseCase: CreateAdministrator", () => {
    let useCase: CreateAdministratorUseCase;
    let administratorRepo: jest.Mocked<AdministratorRepository>;
    let hashProvider: jest.Mocked<HashProvider>;

    beforeEach(() => {
        administratorRepo = {
            create: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        hashProvider = {
            generateHash: jest.fn(),
        } as unknown as jest.Mocked<HashProvider>;

        useCase = new CreateAdministratorUseCase(administratorRepo, hashProvider);
    });

    it("deve criar um novo administrador com sucesso", async () => {
        const input: CreateAdministratorInputDTO = {
            name: "New Admin",
            email: "newadmin@test.com",
            password: "plain-password"
        };

        const mockedAdmin = makeAdministrator({
            id: 1,
            name: input.name,
            email: makeEmail(input.email),
            password: "hashed-password"
        });

        hashProvider.generateHash.mockResolvedValue("hashed-password");
        administratorRepo.create.mockResolvedValue(mockedAdmin);

        const result = await useCase.execute(input);

        expect(hashProvider.generateHash).toHaveBeenCalledWith(input.password);
        expect(administratorRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            name: input.name,
            password: "hashed-password",
            email: expect.any(Object)
        }));

        expect(result.id).toBe(1);
        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
    });

    it("deve propagar ConflictError se o e-mail já estiver em uso", async () => {
        const input: CreateAdministratorInputDTO = {
            name: "Duplicate Admin",
            email: "existing@test.com",
            password: "password"
        };

        hashProvider.generateHash.mockResolvedValue("hash");
        administratorRepo.create.mockRejectedValue(new ConflictError("E-mail já em uso."));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("E-mail já em uso.");
    });
});
