import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { ListNeighborhoodsOutputDTO } from "../../dtos/neighborhood/ListNeighborhoodsDTO.js";

/**
 * @class ListNeighborhoodsUseCase
 * @description Caso de uso responsável por listar e filtrar bairros.
 */
export class ListNeighborhoodsUseCase {
  constructor(private neighborhoodRepository: NeighborhoodRepository) { }

  /**
   * Lista todos os bairros ou filtra por rota.
   * @param routeId Filtro opcional por ID da rota.
   * @returns Lista de DTOs de bairros.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(routeId?: number): Promise<ListNeighborhoodsOutputDTO[]> {
    const neighborhoods = routeId 
      ? await this.neighborhoodRepository.findByRouteId(routeId)
      : await this.neighborhoodRepository.findAll();

    return neighborhoods.map(neighborhood => ({
      id: neighborhood.id,
      name: neighborhood.name,
      populationEstimate: neighborhood.populationEstimate.getValue(),
      postalCode: neighborhood.postalCode.getValue(),
      postalCodeFormatted: neighborhood.postalCode.getFormatted(),
      latitude: neighborhood.geoLocation.getLatitude(),
      longitude: neighborhood.geoLocation.getLongitude(),
      routeId: neighborhood.routeId,
      adminIdCreated: neighborhood.adminIdCreated,
      adminIdUpdated: neighborhood.adminIdUpdated,
      createdAt: neighborhood.createdAt,
      updatedAt: neighborhood.updatedAt
    }));
  }
}
