import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";

/**
 * @class DeleteRouteUseCase
 * @description Caso de uso responsável por remover uma rota do sistema.
 */
export class DeleteRouteUseCase {
  constructor(
    private routeRepository: RouteRepository
  ) { }

  /**
   * Executa a remoção.
   * @param id ID da rota.
   * @throws {EntityNotFoundError} Se a rota não existir.
   * @throws {DependencyError} Se a rota tiver bairros vinculados.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number): Promise<void> {
    await this.routeRepository.delete(id);
  }
}
