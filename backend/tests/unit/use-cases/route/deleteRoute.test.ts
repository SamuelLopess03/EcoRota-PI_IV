import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { DeleteRouteUseCase } from "../../../../src/application/use-cases/route/DeleteRouteUseCase.js";

import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { DependencyError } from "../../../../src/domain/errors/persistence/DependencyError.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: DeleteRoute", () => {
    let useCase: DeleteRouteUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        routeRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>; 

        useCase = new DeleteRouteUseCase(routeRepo);
    });

    it("deve deletar a rota que não possui bairros vinculados", async () => {
        const id = 1;

        routeRepo.delete.mockResolvedValue(undefined);

        await useCase.execute(id);

        expect(routeRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro DependencyError se a rota tiver bairros vinculados", async () => {
        const id = 1;

        routeRepo.delete.mockRejectedValue(
            new DependencyError("Não é possível excluir esta rota pois existem bairros vinculados a ela.")
        );

        await expect(useCase.execute(id)).rejects.toThrow(DependencyError);
        await expect(useCase.execute(id)).rejects.toThrow("Não é possível excluir esta rota pois existem bairros vinculados a ela.");

        expect(routeRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro EntityNotFoundError se a rota não existir para deletar", async () => {
        const id = 1;

        routeRepo.delete.mockRejectedValue(new EntityNotFoundError("Rota", id))

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Rota com identificador '${id}' não foi encontrado.`);

        expect(routeRepo.delete).toHaveBeenCalledWith(id);
    });
})