import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { CreateNeighborhoodInputDTO, CreateNeighborhoodOutputDTO } from "../../dtos/neighborhood/CreateNeighborhoodDTO.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { PopulationEstimate } from "../../../domain/value-objects/PopulationEstimate.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

/**
 * @class CreateNeighborhoodUseCase
 * @description Caso de uso responsável pelo cadastro de um novo bairro vinculado a uma rota de coleta.
 */
export class CreateNeighborhoodUseCase {
  constructor(
    private neighborhoodRepository: NeighborhoodRepository,
    private routeRepository: RouteRepository
  ) { }

  /**
   * Executa a criação do bairro.
   * @param input Dados do novo bairro.
   * @returns DTO com os dados do bairro criado.
   * @throws {EntityNotFoundError} Se a rota informada não existir.
   * @throws {ConflictError} Se houver conflito de nome ou localização.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   * @throws {InvalidPostalCodeError} Se o CEP for inválido.
   * @throws {InvalidPopulationEstimateError} Se a estimativa populacional for inválida.
   * @throws {InvalidGeoLocationError} Se a geolocalização for inválida.
   */
  async execute(input: CreateNeighborhoodInputDTO): Promise<CreateNeighborhoodOutputDTO> {
    await this.routeRepository.findById(input.routeId);

    const postalCode = new PostalCode(input.postalCode);
    const populationEstimate = new PopulationEstimate(input.populationEstimate);
    const geoLocation = new GeoLocation(input.latitude, input.longitude);

    const neighborhood = await this.neighborhoodRepository.create({
      name: input.name,
      postalCode,
      populationEstimate,
      geoLocation,
      routeId: input.routeId,
      adminIdCreated: input.adminId,
      adminIdUpdated: null
    });

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
