import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ListSubscribersUseCase } from "../../../../src/application/use-cases/subscriber/ListSubscribersUseCase.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { makeSubscriber } from "../../../helpers/entityFactories.js";

describe("UseCase: ListSubscribers", () => {
    let useCase: ListSubscribersUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        subscriberRepo = {
            findAll: jest.fn(),
            findByNeighborhoodId: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new ListSubscribersUseCase(subscriberRepo);
    });

    it("deve listar todos os assinantes (sem filtro)", async () => {
        const mockedSubscribers = [
            makeSubscriber({ id: 1 }),
            makeSubscriber({ id: 2 })
        ];

        subscriberRepo.findAll.mockResolvedValue(mockedSubscribers);

        const result = await useCase.execute();

        expect(subscriberRepo.findAll).toHaveBeenCalled();
        expect(subscriberRepo.findByNeighborhoodId).not.toHaveBeenCalled();
        expect(result).toHaveLength(2);
        
        expect(result[0].id).toBe(mockedSubscribers[0].id);
        expect(result[0].email).toBe(mockedSubscribers[0].email.getValue());
        expect(result[0].street).toBe(mockedSubscribers[0].address.getStreet());
        expect(result[0].postalCodeFormatted).toBe(mockedSubscribers[0].address.getPostalCode()?.getFormatted());
        
        expect(result[1].id).toBe(mockedSubscribers[1].id);
        expect(result[1].email).toBe(mockedSubscribers[1].email.getValue());
    });

    it("deve listar assinantes filtrados por bairro", async () => {
        const neighborhoodId = 10;
        const mockedSubscribers = [
            makeSubscriber({ id: 1, neighborhoodId })
        ];

        subscriberRepo.findByNeighborhoodId.mockResolvedValue(mockedSubscribers);

        const result = await useCase.execute(neighborhoodId);

        expect(subscriberRepo.findByNeighborhoodId).toHaveBeenCalledWith(neighborhoodId);
        expect(subscriberRepo.findAll).not.toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].neighborhoodId).toBe(neighborhoodId);
        expect(result[0].email).toBe(mockedSubscribers[0].email.getValue());
    });

    it("deve retornar lista vazia se nenhum assinante for encontrado", async () => {
        subscriberRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
