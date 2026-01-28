import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { FindSubscriberByIdOutputDTO } from "../../dtos/subscriber/FindSubscriberByIdDTO.js";

/**
 * @class FindSubscriberByIdUseCase
 * @description Caso de uso para recuperar dados de um assinante específico.
 */
export class FindSubscriberByIdUseCase {
  constructor(private subscriberRepository: SubscriberRepository) { }

  /**
   * Executa a busca.
   * @param id ID do assinante.
   * @throws {EntityNotFoundError} Se não for encontrado.
   * @throws {PersistenceError} Se houver um erro na persistência.
   */
  async execute(id: number): Promise<FindSubscriberByIdOutputDTO> {
    const subscriber = await this.subscriberRepository.findById(id);

    return {
      id: subscriber.id,
      email: subscriber.email.getValue(),
      street: subscriber.address.getStreet(),
      number: subscriber.address.getNumber(),
      complement: subscriber.address.getComplement(),
      postalCode: subscriber.address.getPostalCode()?.getValue(),
      postalCodeFormatted: subscriber.address.getPostalCode()?.getFormatted(),
      latitude: subscriber.address.getGeoLocation()?.getLatitude(),
      longitude: subscriber.address.getGeoLocation()?.getLongitude(),
      neighborhoodId: subscriber.neighborhoodId,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt
    };
  }
}
