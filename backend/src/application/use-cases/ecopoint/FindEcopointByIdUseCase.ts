import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { FindEcopointByIdOutputDTO } from "../../dtos/ecopoint/FindEcopointByIdDTO.js";

/**
 * @class FindEcopointByIdUseCase
 * @description Caso de uso para recuperar detalhes de um ecoponto específico.
 */
export class FindEcopointByIdUseCase {
  constructor(private ecopointRepository: EcopointRepository) { }

  /**
   * Executa a busca do ecoponto.
   * @param id ID do ecoponto.
   * @returns DTO com os dados do ecoponto.
   * @throws {EntityNotFoundError} Se o ecoponto não for encontrado.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number): Promise<FindEcopointByIdOutputDTO> {
    const ecopoint = await this.ecopointRepository.findById(id);

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
