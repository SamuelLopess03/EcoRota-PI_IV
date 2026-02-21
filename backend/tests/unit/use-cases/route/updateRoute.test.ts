import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateRouteUseCase } from "../../../../src/application/use-cases/route/UpdateRouteUseCase.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { makeRoute } from "../../../helpers/entityFactories.js";
import { UpdateRouteInputDTO } from "../../../../src/application/dtos/route/UpdateRouteDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { makeCollectionDays, makeCollectionTime, makeCollectionType } from "../../../helpers/valueObjectFactories.js";
import { WeekDay } from "../../../../src/domain/value-objects/WeekDay.js";

describe("UseCase: UpdateRoute", () => {
    let useCase: UpdateRouteUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        routeRepo = {
            findById: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        useCase = new UpdateRouteUseCase(routeRepo);
    });

    it("deve atualizar o perfil completo da rota", async () => {
        const id = 5;
        const input: UpdateRouteInputDTO = {
            name: "Rota Sul Atualizada",
            collectionDays: ["tuesday", "thursday"],
            startTime: "14:00",
            endTime: "18:00",
            collectionType: "Coleta regular",
            adminId: 2
        };

        const currentRoute = makeRoute({ id });
        const updatedRoute = makeRoute({
            id,
            name: input.name,
            collectionDays: makeCollectionDays(input.collectionDays as WeekDay[]),
            collectionTime: makeCollectionTime(input.startTime, input.endTime),
            collectionType: makeCollectionType(input.collectionType),
            adminIdUpdated: input.adminId
        });

        routeRepo.findById.mockResolvedValue(currentRoute);
        routeRepo.update.mockResolvedValue(updatedRoute);

        const result = await useCase.execute(id, input);

        expect(routeRepo.findById).toHaveBeenCalledWith(id);
        expect(routeRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            name: input.name,
            adminIdUpdated: input.adminId,
            collectionDays: expect.any(Object),
            collectionTime: expect.any(Object),
            collectionType: expect.any(Object),
        }));

        expect(result.name).toBe(input.name);
        expect(result.startTime).toBe(input.startTime);
        expect(result.collectionType).toBe(input.collectionType);
    });

    it("deve atualizar apenas campos parciais", async () => {
        const id = 5;
        const input: UpdateRouteInputDTO = {
            name: "Novo Nome Apenas",
            adminId: 2
        };

        const currentRoute = makeRoute({ id });
        const updatedRoute = makeRoute({
            id,
            name: input.name,
            adminIdUpdated: input.adminId
        });

        routeRepo.findById.mockResolvedValue(currentRoute);
        routeRepo.update.mockResolvedValue(updatedRoute);

        const result = await useCase.execute(id, input);

        expect(routeRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            name: input.name,
            adminIdUpdated: input.adminId
        }));
        expect(result.name).toBe(input.name);
        expect(result.startTime).toBe(currentRoute.collectionTime.getStartTime());
    });

    it("deve propagar erro EntityNotFoundError se a rota não existir", async () => {
        const id = 999;
        routeRepo.findById.mockRejectedValue(new EntityNotFoundError("Rota", id));

        await expect(useCase.execute(id, { name: "Teste", adminId: 1 })).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id, { name: "Teste", adminId: 1 })).rejects.toThrow(`Rota com identificador '${id}' não foi encontrado.`);
    });
});
