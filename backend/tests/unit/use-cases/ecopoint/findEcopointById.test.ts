import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { FindEcopointByIdUseCase } from "../../../../src/application/use-cases/ecopoint/FindEcopointByIdUseCase.js";
import { EcopointRepository } from "../../../../src/domain/repositories/EcopointRepository.js";
import { makeEcopoint } from "../../../helpers/entityFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: FindEcopointById", () => {
    let useCase: FindEcopointByIdUseCase;
    let ecopointRepo: jest.Mocked<EcopointRepository>;

    beforeEach(() => {
        ecopointRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<EcopointRepository>;

        useCase = new FindEcopointByIdUseCase(ecopointRepo);
    });

    it("deve retornar um ecoponto pelo ID com sucesso", async () => {
        const id = 1;
        const mockedEcopoint = makeEcopoint({ id, name: "Ecoponto Centro" });

        ecopointRepo.findById.mockResolvedValue(mockedEcopoint);

        const result = await useCase.execute(id);

        expect(ecopointRepo.findById).toHaveBeenCalledWith(id);
        expect(result.id).toBe(id);
        expect(result.name).toBe("Ecoponto Centro");
        expect(result.materialsLocalized).toBeDefined();
    });

    it("deve propagar EntityNotFoundError se o ecoponto não existir", async () => {
        const id = 999;
        ecopointRepo.findById.mockRejectedValue(new EntityNotFoundError("Ecoponto", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Ecoponto com identificador '${id}' não foi encontrado.`);
    });
});
