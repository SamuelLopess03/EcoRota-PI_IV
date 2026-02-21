import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListRoutesUseCase } from "../../../../src/application/use-cases/route/ListRoutesUseCase.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { makeRoute } from "../../../helpers/entityFactories.js";

describe("UseCase: ListRoutes", () => {
    let useCase: ListRoutesUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        routeRepo = {
            findAll: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        useCase = new ListRoutesUseCase(routeRepo);
    });

    it("deve listar todas as rotas com sucesso", async () => {
        const mockedRoutes = [
            makeRoute({ id: 1, name: "Rota 1" }),
            makeRoute({ id: 2, name: "Rota 2" })
        ];

        routeRepo.findAll.mockResolvedValue(mockedRoutes);

        const result = await useCase.execute();

        expect(routeRepo.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        
        expect(result[0].id).toBe(1);
        expect(result[0].name).toBe("Rota 1");
        expect(result[0].collectionDaysLocalized).toBe(mockedRoutes[0].collectionDays.toLocalizedString());
        
        expect(result[1].id).toBe(2);
    });

    it("deve retornar lista vazia se nenhuma rota for encontrada", async () => {
        routeRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
