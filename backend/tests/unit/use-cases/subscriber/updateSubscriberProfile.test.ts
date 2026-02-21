import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateSubscriberProfileUseCase } from "../../../../src/application/use-cases/subscriber/UpdateSubscriberProfileUseCase.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { makeSubscriber, makeNeighborhood } from "../../../helpers/entityFactories.js";
import { makeEmail, makeAddress } from "../../../helpers/valueObjectFactories.js";
import { UpdateSubscriberInputDTO } from "../../../../src/application/dtos/subscriber/UpdateSubscriberDTO.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";
import { PostalCode } from "../../../../src/domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../../src/domain/value-objects/GeoLocation.js";

describe("UseCase: UpdateSubscriberProfile", () => {
    let useCase: UpdateSubscriberProfileUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        subscriberRepo = {
            findById: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        neighborhoodRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new UpdateSubscriberProfileUseCase(subscriberRepo, neighborhoodRepo);
    });

    it("deve atualizar o perfil completo do assinante", async () => {
        const id = 1;
        const input: UpdateSubscriberInputDTO = {
            email: "novo@email.com",
            neighborhoodId: 20,
            street: "Nova Rua",
            number: "500",
            postalCode: "12345-678",
            latitude: -10,
            longitude: -40
        };

        const currentSubscriber = makeSubscriber({ id });
        const mockedNeighborhood = makeNeighborhood({ id: 20 });
        const updatedSubscriber = makeSubscriber({
            id,
            email: makeEmail(input.email),
            neighborhoodId: input.neighborhoodId,
            address: makeAddress({
                street: input.street,
                number: input.number,
                postalCode: new PostalCode(input.postalCode!),
                geoLocation: new GeoLocation(input.latitude!, input.longitude!)
            })
        });

        subscriberRepo.findById.mockResolvedValue(currentSubscriber);
        neighborhoodRepo.findById.mockResolvedValue(mockedNeighborhood);
        subscriberRepo.update.mockResolvedValue(updatedSubscriber);

        const result = await useCase.execute(id, input);

        expect(subscriberRepo.findById).toHaveBeenCalledWith(id);
        expect(neighborhoodRepo.findById).toHaveBeenCalledWith(input.neighborhoodId!);
        expect(subscriberRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            email: expect.any(Object),
            neighborhoodId: input.neighborhoodId,
            address: expect.any(Object)
        }));
        expect(result.id).toBe(id);
        expect(result.email).toBe(input.email);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.neighborhoodId).toBe(input.neighborhoodId);
        expect(result.postalCode).toBe("12345678");
        expect(result.postalCodeFormatted).toBe("12345-678");
        expect(result.latitude).toBe(input.latitude);
        expect(result.longitude).toBe(input.longitude);
    });

    it("deve atualizar apenas campos parciais (ex: endereço)", async () => {
        const id = 1;
        const input: UpdateSubscriberInputDTO = {
            street: "Rua Atualizada",
        };

        const currentSubscriber = makeSubscriber({ id });
        const updatedSubscriber = makeSubscriber({
            id,
            address: currentSubscriber.address.withChanges({ street: input.street })
        });

        subscriberRepo.findById.mockResolvedValue(currentSubscriber);
        subscriberRepo.update.mockResolvedValue(updatedSubscriber);

        const result = await useCase.execute(id, input);

        expect(neighborhoodRepo.findById).not.toHaveBeenCalled();
        expect(subscriberRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
            address: expect.any(Object)
        }));
        expect(result.street).toBe(input.street);
        expect(result.email).toBe(currentSubscriber.email.getValue());
        expect(result.postalCodeFormatted).toBe(updatedSubscriber.address.getPostalCode()?.getFormatted());
    });

    it("deve propagar EntityNotFoundError se o assinante não existir", async () => {
        const id = 999;
        subscriberRepo.findById.mockRejectedValue(new EntityNotFoundError("Assinante", id));

        await expect(useCase.execute(id, {})).rejects.toThrow(EntityNotFoundError);
    });

    it("deve propagar EntityNotFoundError se o novo bairro não existir", async () => {
        const id = 1;
        const input = { neighborhoodId: 99 };
        
        subscriberRepo.findById.mockResolvedValue(makeSubscriber({ id }));
        neighborhoodRepo.findById.mockRejectedValue(new EntityNotFoundError("Bairro", 99));

        await expect(useCase.execute(id, input)).rejects.toThrow(EntityNotFoundError);
    });

    it("deve propagar ConflictError se o novo e-mail já estiver em uso", async () => {
        const id = 1;
        const input = { email: "já-existe@teste.com" };

        subscriberRepo.findById.mockResolvedValue(makeSubscriber({ id }));
        subscriberRepo.update.mockRejectedValue(new ConflictError("E-mail já cadastrado."));

        await expect(useCase.execute(id, input)).rejects.toThrow(ConflictError);
    });
});
