import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { RegisterSubscriberUseCase } from "../../../../src/application/use-cases/subscriber/RegisterSubscriberUseCase.js";
import { makeNeighborhood, makeSubscriber } from "../../../helpers/entityFactories.js";
import { makeEmail, makeAddress } from "../../../helpers/valueObjectFactories.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { NeighborhoodRepository } from "../../../../src/domain/repositories/NeighborhoodRepository.js";
import { RegisterSubscriberInputDTO } from "../../../../src/application/dtos/subscriber/RegisterSubscriberDTO.js";
import { PostalCode } from "../../../../src/domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../../src/domain/value-objects/GeoLocation.js";

import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../../src/domain/errors/persistence/ConflictError.js";

describe("UseCase: RegisterSubscriber", () => {
    let useCase: RegisterSubscriberUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;
    let neighborhoodRepo: jest.Mocked<NeighborhoodRepository>;

    beforeEach(() => {
        subscriberRepo = {
            create: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        neighborhoodRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<NeighborhoodRepository>;

        useCase = new RegisterSubscriberUseCase(subscriberRepo, neighborhoodRepo);
    });

    it("deve registrar um novo assinante com sucesso", async () => {
        const input: RegisterSubscriberInputDTO = {
            email: "novo@assinante.com",
            street: "Rua das Flores",
            number: "100",
            neighborhoodId: 10,
            postalCode: "64000-000",
            latitude: -5.0,
            longitude: -42.0
        };

        const mockedNeighborhood = makeNeighborhood();
        const mockedSubscriber = makeSubscriber({ 
            id: 1,
            email: makeEmail(input.email), 
            neighborhoodId: input.neighborhoodId,
            address: makeAddress({
                street: input.street,
                number: input.number,
                postalCode: new PostalCode(input.postalCode!),
                geoLocation: new GeoLocation(input.latitude!, input.longitude!)
            })
        });

        neighborhoodRepo.findById.mockResolvedValue(mockedNeighborhood);
        subscriberRepo.create.mockResolvedValue(mockedSubscriber);

        const result = await useCase.execute(input);

        expect(neighborhoodRepo.findById).toHaveBeenCalledWith(10);
        expect(subscriberRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                neighborhoodId: input.neighborhoodId,
                email: expect.any(Object)
            })
        );

        expect(result.id).toBe(mockedSubscriber.id);
        expect(result.email).toBe(input.email);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.neighborhoodId).toBe(input.neighborhoodId);
        expect(result.postalCode).toBe("64000000");
        expect(result.postalCodeFormatted).toBe("64000-000");
        expect(result.latitude).toBe(input.latitude);
        expect(result.longitude).toBe(input.longitude);
    });

    it("deve propagar erro EntityNotFoundError se o bairro não existir", async () => {
        const input: RegisterSubscriberInputDTO = {
            email: "teste@teste.com",
            street: "Rua A",
            neighborhoodId: 99,
        };

        neighborhoodRepo.findById.mockRejectedValue(new EntityNotFoundError("Neighborhood", 99));

        await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(input)).rejects.toThrow("Neighborhood com identificador '99' não foi encontrado.");
    });

    it("deve propagar erro ConflictError se o e-mail já estiver cadastrado", async () => {
        const input: RegisterSubscriberInputDTO = {
            email: "existente@teste.com",
            street: "Rua A",
            neighborhoodId: 10,
        };

        neighborhoodRepo.findById.mockResolvedValue(makeNeighborhood());
        subscriberRepo.create.mockRejectedValue(new ConflictError("E-mail já cadastrado."));

        await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
        await expect(useCase.execute(input)).rejects.toThrow("E-mail já cadastrado.");
    });
});
