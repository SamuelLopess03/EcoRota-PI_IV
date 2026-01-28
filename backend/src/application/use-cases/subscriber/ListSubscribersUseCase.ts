import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { ListSubscribersOutputDTO } from "../../dtos/subscriber/ListSubscribersDTO.js";

/**
 * @class ListSubscribersUseCase
 * @description Caso de uso para listar todos os assinantes, permitindo filtros.
 */
export class ListSubscribersUseCase {
  constructor(private subscriberRepository: SubscriberRepository) { }

  /**
   * Executa a listagem.
   * @param neighborhoodId Filtro opcional por bairro.
   * @throws {PersistenceError} Se houver um erro na persistência.
   */
  async execute(neighborhoodId?: number): Promise<ListSubscribersOutputDTO[]> {
    const subscribers = neighborhoodId 
      ? await this.subscriberRepository.findByNeighborhoodId(neighborhoodId)
      : await this.subscriberRepository.findAll();

    return subscribers.map(subscriber => ({
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
    }));
  }
}
