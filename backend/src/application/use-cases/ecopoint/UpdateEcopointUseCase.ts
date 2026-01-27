import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { UpdateEcopointInputDTO, UpdateEcopointOutputDTO } from "../../dtos/ecopoint/UpdateEcopointDTO.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { MaterialType } from "../../../domain/value-objects/MaterialType.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { WeekDay } from "../../../domain/value-objects/WeekDay.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";

/**
 * @class UpdateEcopointUseCase
 * @description Caso de uso responsável pela atualização dos dados de um ecoponto.
 */
export class UpdateEcopointUseCase {
  constructor(
    private ecopointRepository: EcopointRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa a atualização do ecoponto.
   * @param id ID do ecoponto.
   * @param input Dados para atualização.
   * @returns DTO com os dados do ecoponto atualizado.
   * @throws {EntityNotFoundError} Se o ecoponto ou o bairro informado não existirem.
   * @throws {InvalidAddressError} Se o endereço for inválido.
   * @throws {InvalidAcceptedMaterialsError} Se os materiais forem inválidos.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidGeoLocationError} Se a localização for inválida.
   * @throws {InvalidCollectionDaysError} Se os dias forem inválidos.
   * @throws {InvalidCollectionTimeError} Se os horários forem inválidos.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number, input: UpdateEcopointInputDTO): Promise<UpdateEcopointOutputDTO> {
    const currentEcopoint = await this.ecopointRepository.findById(id);

    if (input.neighborhoodId) {
      await this.neighborhoodRepository.findById(input.neighborhoodId);
    }
    const dataToUpdate: any = {
      adminIdUpdated: input.adminId
    };

    if (input.name) dataToUpdate.name = input.name;

    if (input.materials) {
      dataToUpdate.acceptedMaterials = new AcceptedMaterials(input.materials as MaterialType[]);
    }

    if (input.neighborhoodId) {
      dataToUpdate.neighborhoodId = input.neighborhoodId;
    }

    if (input.collectionDays) {
      dataToUpdate.collectionDays = new CollectionDays(input.collectionDays as WeekDay[]);
    }

    if (input.startTime !== undefined || input.endTime !== undefined) {
      const start = input.startTime ?? currentEcopoint.collectionTime.getStartTime();
      const end = input.endTime ?? currentEcopoint.collectionTime.getEndTime();
      dataToUpdate.collectionTime = new CollectionTime(start, end);
    }

    if (
      input.street ||
      input.number ||
      input.complement ||
      input.postalCode ||
      (input.latitude !== undefined && input.longitude !== undefined)
    ) {
      let newPostalCode = currentEcopoint.address.getPostalCode();
      if (input.postalCode) {
        newPostalCode = new PostalCode(input.postalCode);
      }

      let newGeoLocation = currentEcopoint.address.getGeoLocation();
      if (input.latitude !== undefined && input.longitude !== undefined) {
        newGeoLocation = new GeoLocation(input.latitude, input.longitude);
      }

      dataToUpdate.address = currentEcopoint.address.withChanges({
        street: input.street,
        number: input.number,
        complement: input.complement,
        postalCode: newPostalCode,
        geoLocation: newGeoLocation
      });
    }

    const updatedEcopoint = await this.ecopointRepository.update(id, dataToUpdate);

    return {
      id: updatedEcopoint.id,
      name: updatedEcopoint.name,
      materials: updatedEcopoint.acceptedMaterials.getMaterials() as string[],
      materialsLocalized: updatedEcopoint.acceptedMaterials.toLocalizedString(),
      street: updatedEcopoint.address.getStreet(),
      number: updatedEcopoint.address.getNumber(),
      complement: updatedEcopoint.address.getComplement(),
      postalCode: updatedEcopoint.address.getPostalCode()?.getValue(),
      latitude: updatedEcopoint.address.getGeoLocation()!.getLatitude(),
      longitude: updatedEcopoint.address.getGeoLocation()!.getLongitude(),
      collectionDays: updatedEcopoint.collectionDays.getDays() as string[],
      collectionDaysLocalized: updatedEcopoint.collectionDays.toLocalizedString(),
      startTime: updatedEcopoint.collectionTime.getStartTime(),
      endTime: updatedEcopoint.collectionTime.getEndTime(),
      neighborhoodId: updatedEcopoint.neighborhoodId,
      createdAt: updatedEcopoint.createdAt,
      updatedAt: updatedEcopoint.updatedAt,
      adminIdCreated: updatedEcopoint.adminIdCreated,
      adminIdUpdated: updatedEcopoint.adminIdUpdated
    };
  }
}
