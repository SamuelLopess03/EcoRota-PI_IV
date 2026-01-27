import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { UpdateNeighborhoodInputDTO, UpdateNeighborhoodOutputDTO } from "../../dtos/neighborhood/UpdateNeighborhoodDTO.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { PopulationEstimate } from "../../../domain/value-objects/PopulationEstimate.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

/**
 * @class UpdateNeighborhoodUseCase
 * @description Caso de uso responsável por atualizar os dados de um bairro.
 */
export class UpdateNeighborhoodUseCase {
  constructor(
    private neighborhoodRepository: NeighborhoodRepository,
    private routeRepository: RouteRepository
  ) { }

  /**
   * Executa a atualização do bairro.
   * @param id ID do bairro a ser atualizado.
   * @param input Dados a serem alterados.
   * @returns DTO com os dados atualizados.
   * @throws {EntityNotFoundError} Se o bairro ou a nova rota não existirem.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   * @throws {ConflictError} Se houver conflito de nome ou localização.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidPopulationEstimateError} Se a estimativa populacional for inválida.
   * @throws {InvalidGeoLocationError} Se a geolocalização for inválida.
   */
  async execute(id: number, input: UpdateNeighborhoodInputDTO): Promise<UpdateNeighborhoodOutputDTO> {
    if (input.routeId) {
      await this.routeRepository.findById(input.routeId);
    }

    const updateData: any = {
      adminIdUpdated: input.adminId
    };

    if (input.name) updateData.name = input.name;
    if (input.routeId) updateData.routeId = input.routeId;
    
    if (input.postalCode) {
      updateData.postalCode = new PostalCode(input.postalCode);
    }
    
    if (input.populationEstimate !== undefined) {
      updateData.populationEstimate = new PopulationEstimate(input.populationEstimate);
    }

    if (input.latitude !== undefined && input.longitude !== undefined) {
      updateData.geoLocation = new GeoLocation(input.latitude, input.longitude);
    }

    const updatedNeighborhood = await this.neighborhoodRepository.update(id, updateData);

    return {
      id: updatedNeighborhood.id,
      name: updatedNeighborhood.name,
      populationEstimate: updatedNeighborhood.populationEstimate.getValue(),
      postalCode: updatedNeighborhood.postalCode.getValue(),
      postalCodeFormatted: updatedNeighborhood.postalCode.getFormatted(),
      latitude: updatedNeighborhood.geoLocation.getLatitude(),
      longitude: updatedNeighborhood.geoLocation.getLongitude(),
      routeId: updatedNeighborhood.routeId,
      adminIdCreated: updatedNeighborhood.adminIdCreated,
      adminIdUpdated: updatedNeighborhood.adminIdUpdated,
      createdAt: updatedNeighborhood.createdAt,
      updatedAt: updatedNeighborhood.updatedAt
    };
  }
}
