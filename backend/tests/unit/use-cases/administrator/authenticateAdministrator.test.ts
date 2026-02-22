import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { AuthenticateAdministratorUseCase } from "../../../../src/application/use-cases/administrator/AuthenticateAdministratorUseCase.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { HashProvider } from "../../../../src/domain/providers/HashProvider.js";
import { TokenProvider } from "../../../../src/domain/providers/TokenProvider.js";
import { makeAdministrator } from "../../../helpers/entityFactories.js";
import { InvalidCredentialsError } from "../../../../src/application/use-cases/administrator/errors/InvalidCredentialsError.js";
import { AuthenticateAdministratorInputDTO } from "../../../../src/application/dtos/administrator/AuthenticateAdministratorDTO.js";

describe("UseCase: AuthenticateAdministrator", () => {
    let useCase: AuthenticateAdministratorUseCase;
    let administratorRepo: jest.Mocked<AdministratorRepository>;
    let hashProvider: jest.Mocked<HashProvider>;
    let tokenProvider: jest.Mocked<TokenProvider>;

    beforeEach(() => {
        administratorRepo = {
            findByEmail: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        hashProvider = {
            compareHash: jest.fn(),
        } as unknown as jest.Mocked<HashProvider>;

        tokenProvider = {
            generate: jest.fn(),
        } as unknown as jest.Mocked<TokenProvider>;

        useCase = new AuthenticateAdministratorUseCase(
            administratorRepo,
            hashProvider,
            tokenProvider
        );
    });

    it("deve autenticar um administrador com sucesso", async () => {
        const input: AuthenticateAdministratorInputDTO = {
            email: "admin@test.com",
            password: "correct-password"
        };

        const mockedAdmin = makeAdministrator({
            id: 1,
            name: "Admin User",
            password: "hashed-password"
        });

        administratorRepo.findByEmail.mockResolvedValue(mockedAdmin);
        hashProvider.compareHash.mockResolvedValue(true);
        tokenProvider.generate.mockReturnValue("valid-token");

        const result = await useCase.execute(input);

        expect(administratorRepo.findByEmail).toHaveBeenCalledWith(expect.any(Object));
        expect(hashProvider.compareHash).toHaveBeenCalledWith(input.password, mockedAdmin.password);
        expect(tokenProvider.generate).toHaveBeenCalledWith(expect.objectContaining({
            sub: mockedAdmin.id,
            email: mockedAdmin.email.getValue()
        }));

        expect(result.token).toBe("valid-token");
        expect(result.administrator.id).toBe(mockedAdmin.id);
        expect(result.administrator.email).toBe(mockedAdmin.email.getValue());
    });

    it("deve lançar InvalidCredentialsError se o e-mail não for encontrado", async () => {
        const input: AuthenticateAdministratorInputDTO = {
            email: "nonexistent@test.com",
            password: "any-password"
        };

        administratorRepo.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.execute(input)).rejects.toThrow("E-mail ou senha inválidos.");
        
        expect(hashProvider.compareHash).not.toHaveBeenCalled();
    });

    it("deve lançar InvalidCredentialsError se a senha estiver incorreta", async () => {
        const input: AuthenticateAdministratorInputDTO = {
            email: "admin@test.com",
            password: "wrong-password"
        };

        const mockedAdmin = makeAdministrator();
        administratorRepo.findByEmail.mockResolvedValue(mockedAdmin);
        hashProvider.compareHash.mockResolvedValue(false);

        await expect(useCase.execute(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.execute(input)).rejects.toThrow("E-mail ou senha inválidos.");
    });
});
