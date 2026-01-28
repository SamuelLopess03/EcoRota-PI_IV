import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { FindRouteByIdOutputDTO } from "../../dtos/route/FindRouteByIdDTO.js";

/**
 * @class FindRouteByIdUseCase
 * @description Caso de uso para recuperar detalhes de uma rota e seus bairros.
 */
export class FindRouteByIdUseCase {
  constructor(
    private routeRepository: RouteRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa a busca.
   * @param id ID da rota.
   * @throws {EntityNotFoundError} Se a rota não existir.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number): Promise<FindRouteByIdOutputDTO> {
    const route = await this.routeRepository.findById(id);
    const neighborhoods = await this.neighborhoodRepository.findByRouteId(id);

    return {
      id: route.id,
      name: route.name,
      collectionDays: route.collectionDays.getDays() as string[],
      collectionDaysLocalized: route.collectionDays.toLocalizedString(),
      startTime: route.collectionTime.getStartTime(),
      endTime: route.collectionTime.getEndTime(),
      collectionType: route.collectionType.getValue(),
      neighborhoods: neighborhoods.map(n => ({
        id: n.id,
        name: n.name,
        postalCode: n.postalCode.getValue()
      })),
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      adminIdCreated: route.adminIdCreated,
      adminIdUpdated: route.adminIdUpdated
    };
  }
}
