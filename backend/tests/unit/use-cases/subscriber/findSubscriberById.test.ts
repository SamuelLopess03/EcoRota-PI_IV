import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { FindSubscriberByIdUseCase } from "../../../../src/application/use-cases/subscriber/FindSubscriberByIdUseCase.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { makeSubscriber } from "../../../helpers/entityFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: FindSubscriberById", () => {
    let useCase: FindSubscriberByIdUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        subscriberRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new FindSubscriberByIdUseCase(subscriberRepo);
    });

    it("deve retornar um assinante pelo ID", async () => {
        const id = 1;
        const mockedSubscriber = makeSubscriber({ id });

        subscriberRepo.findById.mockResolvedValue(mockedSubscriber);

        const result = await useCase.execute(id);

        expect(subscriberRepo.findById).toHaveBeenCalledWith(id);
        expect(result.id).toBe(id);
        expect(result.email).toBe(mockedSubscriber.email.getValue());
        expect(result.street).toBe(mockedSubscriber.address.getStreet());
        expect(result.number).toBe(mockedSubscriber.address.getNumber());
        expect(result.neighborhoodId).toBe(mockedSubscriber.neighborhoodId);
        expect(result.postalCode).toBe(mockedSubscriber.address.getPostalCode()?.getValue());
        expect(result.postalCodeFormatted).toBe(mockedSubscriber.address.getPostalCode()?.getFormatted());
        expect(result.latitude).toBe(mockedSubscriber.address.getGeoLocation()?.getLatitude());
        expect(result.longitude).toBe(mockedSubscriber.address.getGeoLocation()?.getLongitude());
    });

    it("deve propagar EntityNotFoundError se o ID não existir", async () => {
        const id = 999;

        subscriberRepo.findById.mockRejectedValue(new EntityNotFoundError("Assinante", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Assinante com identificador '${id}' não foi encontrado.`);
    });
});
