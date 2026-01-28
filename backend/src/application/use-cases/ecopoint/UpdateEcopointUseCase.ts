import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { UpdateEcopointInputDTO, UpdateEcopointOutputDTO } from "../../dtos/ecopoint/UpdateEcopointDTO.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { MaterialType } from "../../../domain/value-objects/MaterialType.js";
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
   * @throws {InvalidAcceptedMaterialsError} Se os materiais forem inválidos.
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
    if (input.partnerName !== undefined) dataToUpdate.partnerName = input.partnerName || null;

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

    if (input.latitude !== undefined || input.longitude !== undefined) {
      const lat = input.latitude ?? currentEcopoint.geoLocation.getLatitude();
      const lng = input.longitude ?? currentEcopoint.geoLocation.getLongitude();
      dataToUpdate.geoLocation = new GeoLocation(lat, lng);
    }

    const updatedEcopoint = await this.ecopointRepository.update(id, dataToUpdate);

    return {
      id: updatedEcopoint.id,
      name: updatedEcopoint.name,
      partnerName: updatedEcopoint.partnerName,
      materials: updatedEcopoint.acceptedMaterials.getMaterials() as string[],
      materialsLocalized: updatedEcopoint.acceptedMaterials.toLocalizedString(),
      latitude: updatedEcopoint.geoLocation.getLatitude(),
      longitude: updatedEcopoint.geoLocation.getLongitude(),
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
