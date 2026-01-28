import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { UpdateSubscriberInputDTO, UpdateSubscriberOutputDTO } from "../../dtos/subscriber/UpdateSubscriberDTO.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

/**
 * @class UpdateSubscriberProfileUseCase
 * @description Caso de uso responsável pela atualização dos dados de um assinante.
 */
export class UpdateSubscriberProfileUseCase {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa a atualização do perfil.
   * @param id ID do assinante.
   * @param input Dados a serem atualizados.
   * @returns DTO com os dados atualizados.
   * @throws {InvalidEmailError} Se o formato do e-mail for inválido.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidGeoLocationError} Se a localização geográfica for inválida.
   * @throws {InvalidAddressError} Se o endereço for inválido.
   * @throws {EntityNotFoundError} Se o assinante ou o novo bairro não existirem.
   * @throws {ConflictError} Se o novo e-mail já estiver em uso.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number, input: UpdateSubscriberInputDTO): Promise<UpdateSubscriberOutputDTO> {
    const currentSubscriber = await this.subscriberRepository.findById(id);

    if (input.neighborhoodId) {
      await this.neighborhoodRepository.findById(input.neighborhoodId);
    }
    const dataToUpdate: any = {};

    if (input.email) {
      dataToUpdate.email = new Email(input.email);
    }

    if (input.neighborhoodId) {
      dataToUpdate.neighborhoodId = input.neighborhoodId;
    }

    if (
      input.street || 
      input.number || 
      input.complement || 
      input.postalCode || 
      (input.latitude !== undefined && input.longitude !== undefined)
    ) {
      let newPostalCode = currentSubscriber.address.getPostalCode();
      if (input.postalCode) {
        newPostalCode = new PostalCode(input.postalCode);
      }

      let newGeoLocation = currentSubscriber.address.getGeoLocation();
      if (input.latitude !== undefined && input.longitude !== undefined) {
        newGeoLocation = new GeoLocation(input.latitude, input.longitude);
      }

      dataToUpdate.address = currentSubscriber.address.withChanges({
        street: input.street,
        number: input.number,
        complement: input.complement,
        postalCode: newPostalCode,
        geoLocation: newGeoLocation
      });
    }

    const updatedSubscriber = await this.subscriberRepository.update(id, dataToUpdate);

    return {
      id: updatedSubscriber.id,
      email: updatedSubscriber.email.getValue(),
      street: updatedSubscriber.address.getStreet(),
      number: updatedSubscriber.address.getNumber(),
      complement: updatedSubscriber.address.getComplement(),
      postalCode: updatedSubscriber.address.getPostalCode()?.getValue(),
      postalCodeFormatted: updatedSubscriber.address.getPostalCode()?.getFormatted(),
      latitude: updatedSubscriber.address.getGeoLocation()?.getLatitude(),
      longitude: updatedSubscriber.address.getGeoLocation()?.getLongitude(),
      neighborhoodId: updatedSubscriber.neighborhoodId,
      createdAt: updatedSubscriber.createdAt,
      updatedAt: updatedSubscriber.updatedAt
    };
  }
}
