import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";

/**
 * @class DeleteRouteUseCase
 * @description Caso de uso responsável por deletar uma rota, garantindo que não haja bairros vinculados.
 */
export class DeleteRouteUseCase {
  constructor(
    private routeRepository: RouteRepository,
    private neighborhoodRepository: NeighborhoodRepository
  ) { }

  /**
   * Executa a remoção.
   * @param id ID da rota.
   * @throws {EntityNotFoundError} Se a rota não existir.
   * @throws {ConflictError} Se a rota possuir bairros vinculados.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number): Promise<void> {
    const neighborhoods = await this.neighborhoodRepository.findByRouteId(id);

    if (neighborhoods.length > 0) {
      throw new ConflictError(`Não é possível deletar a rota ${id} pois ela possui bairros vinculados.`);
    }

    await this.routeRepository.delete(id);
  }
}
