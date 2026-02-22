import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListAdministratorsUseCase } from "../../../../src/application/use-cases/administrator/ListAdministratorsUseCase.js";
import { AdministratorRepository } from "../../../../src/domain/repositories/AdministratorRepository.js";
import { makeAdministrator } from "../../../helpers/entityFactories.js";

describe("UseCase: ListAdministrators", () => {
    let useCase: ListAdministratorsUseCase;
    let administratorRepo: jest.Mocked<AdministratorRepository>;

    beforeEach(() => {
        administratorRepo = {
            findAll: jest.fn(),
        } as unknown as jest.Mocked<AdministratorRepository>;

        useCase = new ListAdministratorsUseCase(administratorRepo);
    });

    it("deve listar todos os administradores com sucesso", async () => {
        const mockedAdmins = [
            makeAdministrator({ id: 1, name: "Admin 1" }),
            makeAdministrator({ id: 2, name: "Admin 2" })
        ];

        administratorRepo.findAll.mockResolvedValue(mockedAdmins);

        const result = await useCase.execute();

        expect(administratorRepo.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
        expect(result[0].name).toBe("Admin 1");
    });

    it("deve retornar lista vazia se nenhum administrador for encontrado", async () => {
        administratorRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
