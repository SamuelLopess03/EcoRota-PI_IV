import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { CreateEcopointInputDTO, CreateEcopointOutputDTO } from "../../dtos/ecopoint/CreateEcopointDTO.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { MaterialType } from "../../../domain/value-objects/MaterialType.js";
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
   * @throws {InvalidAcceptedMaterialsError} Se os materiais forem inválidos.
   * @throws {InvalidGeoLocationError} Se a localização for inválida.
   * @throws {InvalidCollectionDaysError} Se os dias forem inválidos.
   * @throws {InvalidCollectionTimeError} Se os horários forem inválidos.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(input: CreateEcopointInputDTO): Promise<CreateEcopointOutputDTO> {
    await this.neighborhoodRepository.findById(input.neighborhoodId);

    const acceptedMaterials = new AcceptedMaterials(input.materials as MaterialType[]);
    const geoLocation = new GeoLocation(input.latitude, input.longitude);
    const collectionDays = new CollectionDays(input.collectionDays as WeekDay[]);
    const collectionTime = new CollectionTime(input.startTime, input.endTime);

    const ecopoint = await this.ecopointRepository.create({
      name: input.name,
      partnerName: input.partnerName || null,
      acceptedMaterials,
      geoLocation,
      collectionDays,
      collectionTime,
      neighborhoodId: input.neighborhoodId,
      adminIdCreated: input.adminId,
      adminIdUpdated: null
    });

    return {
      id: ecopoint.id,
      name: ecopoint.name,
      partnerName: ecopoint.partnerName,
      materials: ecopoint.acceptedMaterials.getMaterials() as string[],
      materialsLocalized: ecopoint.acceptedMaterials.toLocalizedString(),
      latitude: ecopoint.geoLocation.getLatitude(),
      longitude: ecopoint.geoLocation.getLongitude(),
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
