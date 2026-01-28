import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { CreateEcopointInputDTO, CreateEcopointOutputDTO } from "../../dtos/ecopoint/CreateEcopointDTO.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { MaterialType } from "../../../domain/value-objects/MaterialType.js";
import { Address } from "../../../domain/value-objects/Address.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { WeekDay } from "../../../domain/value-objects/WeekDay.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";

/**
 * @class CreateEcopointUseCase
 * @description Caso de uso responsável pela criação de novos ecopontos no sistema.
 */
export class CreateEcopointUseCase {
  constructor(
    private ecopointRepository: EcopointRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa a criação do ecoponto.
   * @param input Dados do ecoponto.
   * @returns DTO com os dados do ecoponto criado.
   * @throws {EntityNotFoundError} Se o bairro não existir.
   * @throws {ConflictError} Se o ecoponto já existir.
   * @throws {InvalidAddressError} Se o endereço for inválido.
   * @throws {InvalidAcceptedMaterialsError} Se os materiais forem inválidos.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidGeoLocationError} Se a localização for inválida.
   * @throws {InvalidCollectionDaysError} Se os dias forem inválidos.
   * @throws {InvalidCollectionTimeError} Se os horários forem inválidos.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(input: CreateEcopointInputDTO): Promise<CreateEcopointOutputDTO> {
    await this.neighborhoodRepository.findById(input.neighborhoodId);

    const acceptedMaterials = new AcceptedMaterials(input.materials as MaterialType[]);
    
    let postalCode: PostalCode | undefined;
    if (input.postalCode) {
      postalCode = new PostalCode(input.postalCode);
    }

    const geoLocation = new GeoLocation(input.latitude, input.longitude);

    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      postalCode,
      geoLocation
    });

    const collectionDays = new CollectionDays(input.collectionDays as WeekDay[]);
    const collectionTime = new CollectionTime(input.startTime, input.endTime);

    const ecopoint = await this.ecopointRepository.create({
      name: input.name,
      acceptedMaterials,
      address,
      collectionDays,
      collectionTime,
      neighborhoodId: input.neighborhoodId,
      adminIdCreated: input.adminId,
      adminIdUpdated: null
    });

    return {
      id: ecopoint.id,
      name: ecopoint.name,
      materials: ecopoint.acceptedMaterials.getMaterials() as string[],
      materialsLocalized: ecopoint.acceptedMaterials.toLocalizedString(),
      street: ecopoint.address.getStreet(),
      number: ecopoint.address.getNumber(),
      complement: ecopoint.address.getComplement(),
      postalCode: ecopoint.address.getPostalCode()?.getValue(),
      latitude: ecopoint.address.getGeoLocation()!.getLatitude(),
      longitude: ecopoint.address.getGeoLocation()!.getLongitude(),
      collectionDays: ecopoint.collectionDays.getDays() as string[],
      collectionDaysLocalized: ecopoint.collectionDays.toLocalizedString(),
      startTime: ecopoint.collectionTime.getStartTime(),
      endTime: ecopoint.collectionTime.getEndTime(),
      neighborhoodId: ecopoint.neighborhoodId,
      createdAt: ecopoint.createdAt,
      updatedAt: ecopoint.updatedAt,
      adminIdCreated: ecopoint.adminIdCreated,
      adminIdUpdated: ecopoint.adminIdUpdated
    };
  }
}
