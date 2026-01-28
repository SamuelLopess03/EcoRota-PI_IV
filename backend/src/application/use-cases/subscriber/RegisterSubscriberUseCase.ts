import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { RegisterSubscriberInputDTO, RegisterSubscriberOutputDTO } from "../../dtos/subscriber/RegisterSubscriberDTO.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { Address } from "../../../domain/value-objects/Address.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

/**
 * @class RegisterSubscriberUseCase
 * @description Caso de uso responsável pelo cadastro de novos assinantes no sistema.
 */
export class RegisterSubscriberUseCase {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa o registro de um novo assinante.
   * @param input Dados do assinante.
   * @returns DTO com os dados do assinante registrado.
   * @throws {EntityNotFoundError} Se o bairro informado não existir.
   * @throws {ConflictError} Se o e-mail já estiver em uso.
   * @throws {InvalidEmailError} Se o formato do e-mail for inválido.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidGeoLocationError} Se a localização geográfica for inválida.
   * @throws {InvalidAddressError} Se o endereço for inválido.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(input: RegisterSubscriberInputDTO): Promise<RegisterSubscriberOutputDTO> {
    await this.neighborhoodRepository.findById(input.neighborhoodId);

    const email = new Email(input.email);
    
    let postalCode: PostalCode | undefined;
    if (input.postalCode) {
      postalCode = new PostalCode(input.postalCode);
    }

    let geoLocation: GeoLocation | undefined;
    if (input.latitude !== undefined && input.longitude !== undefined) {
      geoLocation = new GeoLocation(input.latitude, input.longitude);
    }

    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      postalCode,
      geoLocation
    });

    const subscriber = await this.subscriberRepository.create({
      email,
      address,
      neighborhoodId: input.neighborhoodId
    });
    
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
