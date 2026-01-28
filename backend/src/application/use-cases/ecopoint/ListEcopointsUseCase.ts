import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { ListEcopointsOutputDTO } from "../../dtos/ecopoint/ListEcopointsDTO.js";

/**
 * @class ListEcopointsUseCase
 * @description Caso de uso para listar todos os ecopontos cadastrados.
 */
export class ListEcopointsUseCase {
  constructor(private ecopointRepository: EcopointRepository) { }

  /**
   * Executa a listagem dos ecopontos.
   * @param neighborhoodId ID do bairro para filtro (opcional).
   * @returns Lista de ecopontos em formato DTO.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(neighborhoodId?: number): Promise<ListEcopointsOutputDTO[]> {
    const ecopoints = neighborhoodId
      ? await this.ecopointRepository.findByNeighborhoodId(neighborhoodId)
      : await this.ecopointRepository.findAll();

    return ecopoints.map(ecopoint => ({
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
    }));
  }
}
