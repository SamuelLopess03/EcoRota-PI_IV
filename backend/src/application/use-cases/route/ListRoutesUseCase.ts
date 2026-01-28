import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { ListRoutesOutputDTO } from "../../dtos/route/ListRoutesDTO.js";

/**
 * @class ListRoutesUseCase
 * @description Caso de uso para listar todas as rotas cadastradas.
 */
export class ListRoutesUseCase {
  constructor(private routeRepository: RouteRepository) { }

  /**
   * Executa a listagem.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(): Promise<ListRoutesOutputDTO[]> {
    const routes = await this.routeRepository.findAll();

    return routes.map(route => ({
      id: route.id,
      name: route.name,
      collectionDays: route.collectionDays.getDays() as string[],
      collectionDaysLocalized: route.collectionDays.toLocalizedString(),
      startTime: route.collectionTime.getStartTime(),
      endTime: route.collectionTime.getEndTime(),
      collectionType: route.collectionType.getValue(),
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      adminIdCreated: route.adminIdCreated,
      adminIdUpdated: route.adminIdUpdated
    }));
  }
}
