import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { FindNeighborhoodByIdOutputDTO } from "../../dtos/neighborhood/FindNeighborhoodByIdDTO.js";

/**
 * @class FindNeighborhoodByIdUseCase
 * @description Caso de uso responsável por buscar os detalhes de um bairro específico.
 */
export class FindNeighborhoodByIdUseCase {
  constructor(private neighborhoodRepository: NeighborhoodRepository) { }

  /**
   * Executa a busca pelo ID.
   * @param id ID do bairro.
   * @returns DTO com os dados do bairro.
   * @throws {EntityNotFoundError} Se o bairro não for encontrado.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(id: number): Promise<FindNeighborhoodByIdOutputDTO> {
    const neighborhood = await this.neighborhoodRepository.findById(id);

    return {
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
    };
  }
}
