import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateRouteUseCase } from "../../../../src/application/use-cases/route/CreateRouteUseCase.js";
import { RouteRepository } from "../../../../src/domain/repositories/RouteRepository.js";
import { makeRoute } from "../../../helpers/entityFactories.js";
import { CreateRouteInputDTO } from "../../../../src/application/dtos/route/CreateRouteDTO.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";

describe("UseCase: CreateRoute", () => {
    let useCase: CreateRouteUseCase;
    let routeRepo: jest.Mocked<RouteRepository>;

    beforeEach(() => {
        routeRepo = {
            create: jest.fn(),
        } as unknown as jest.Mocked<RouteRepository>;

        useCase = new CreateRouteUseCase(routeRepo);
    });

    it("deve criar uma nova rota com sucesso", async () => {
        const input: CreateRouteInputDTO = {
            name: "Rota Norte",
            collectionDays: ["monday", "wednesday", "friday"],
            startTime: "08:00",
            endTime: "12:00",
            collectionType: "Coleta seletiva",
            adminId: 1
        };

        const mockedRoute = makeRoute({
            id: 1,
            name: input.name,
            adminIdCreated: input.adminId
        });

        routeRepo.create.mockResolvedValue(mockedRoute);

        const result = await useCase.execute(input);

        expect(routeRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: input.name,
                collectionDays: expect.any(Object),
                collectionTime: expect.any(Object),
                collectionType: expect.any(Object),
                adminIdCreated: input.adminId
            })
        );

        expect(result.id).toBe(1);
        expect(result.name).toBe(input.name);
        expect(result.startTime).toBe(input.startTime);
        expect(result.endTime).toBe(input.endTime);
        expect(result.collectionType).toBe(input.collectionType);
        expect(result.adminIdCreated).toBe(input.adminId);
    });

    it("deve propagar erro ConflictError se o nome da rota já existir", async () => {
        const input: CreateRouteInputDTO = {
            name: "Rota Existente",
            collectionDays: ["monday"],
            startTime: "08:00",
            endTime: "12:00",
            collectionType: "Coleta regular",
            adminId: 1
        };

        routeRepo.create.mockRejectedValue(new ConflictError("Nome de rota já em uso."));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("Nome de rota já em uso.");
    });
});
