import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UnsubscribeUseCase } from "../../../../src/application/use-cases/subscriber/UnsubscribeUseCase.js";
import { SubscriberRepository } from "../../../../src/domain/repositories/SubscriberRepository.js";
import { EntityNotFoundError } from "../../../../src/domain/errors/persistence/EntityNotFoundError.js";

describe("UseCase: Unsubscribe", () => {
    let useCase: UnsubscribeUseCase;
    let subscriberRepo: jest.Mocked<SubscriberRepository>;

    beforeEach(() => {
        subscriberRepo = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<SubscriberRepository>;

        useCase = new UnsubscribeUseCase(subscriberRepo);
    });

    it("deve remover um assinante com sucesso", async () => {
        const id = 1;

        subscriberRepo.delete.mockResolvedValue();

        await useCase.execute(id);

        expect(subscriberRepo.delete).toHaveBeenCalledWith(id);
    });

    it("deve propagar erro EntityNotFoundError se o assinante não existir", async () => {
        const id = 999;
        subscriberRepo.delete.mockRejectedValue(new EntityNotFoundError("Assinante", id));

        await expect(useCase.execute(id)).rejects.toThrow(EntityNotFoundError);
        await expect(useCase.execute(id)).rejects.toThrow(`Assinante com identificador '${id}' não foi encontrado.`);
        expect(subscriberRepo.delete).toHaveBeenCalledWith(id);
    });
});
