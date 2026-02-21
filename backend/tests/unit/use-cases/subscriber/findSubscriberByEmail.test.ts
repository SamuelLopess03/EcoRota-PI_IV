import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { FindSubscriberByEmailUseCase } from "../../../../src/application/use-cases/subscriber/FindSubscriberByEmailUseCase.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { makeSubscriber } from "../../../helpers/entityFactories.js";
import { makeEmail } from "../../../helpers/valueObjectFactories.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: FindSubscriberByEmail", () => {
    let useCase: FindSubscriberByEmailUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        subscriberRepo = {
            findByEmail: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new FindSubscriberByEmailUseCase(subscriberRepo);
    });

    it("deve consultar um assinante com o e-mail válido", async () => {
        const input = "user@tester.com";
        const mockedSubscriber = makeSubscriber({
            email: makeEmail(input)
        });

        subscriberRepo.findByEmail.mockResolvedValue(mockedSubscriber);

        const result = await useCase.execute(input);

        expect(subscriberRepo.findByEmail).toHaveBeenCalledWith(expect.any(Object));
        expect(result.id).toBe(mockedSubscriber.id);
        expect(result.email).toBe(input);
        expect(result.street).toBe(mockedSubscriber.address.getStreet());
        expect(result.number).toBe(mockedSubscriber.address.getNumber());
        expect(result.neighborhoodId).toBe(mockedSubscriber.neighborhoodId);
        expect(result.postalCode).toBe(mockedSubscriber.address.getPostalCode()?.getValue());
        expect(result.postalCodeFormatted).toBe(mockedSubscriber.address.getPostalCode()?.getFormatted());
        expect(result.latitude).toBe(mockedSubscriber.address.getGeoLocation()?.getLatitude());
        expect(result.longitude).toBe(mockedSubscriber.address.getGeoLocation()?.getLongitude());
    });

    it("deve propagar erro EntityNotFoundError se o assinante não existir", async () => {
        const input = "novo@assinante.com";

        subscriberRepo.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(input)).rejects.toThrow(`Assinante com identificador '${input}' não foi encontrado.`);
    });
});
