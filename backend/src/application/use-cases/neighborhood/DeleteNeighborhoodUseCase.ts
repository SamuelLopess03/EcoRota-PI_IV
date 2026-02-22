import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";

/**
 * @class DeleteNeighborhoodUseCase
 * @description Caso de uso responsável por remover um bairro do sistema.
 */
export class DeleteNeighborhoodUseCase {
  constructor(private neighborhoodRepository: NeighborhoodRepository) { }

  /**
   * Executa a remoção.
   * @param id ID do bairro.
   * @throws {EntityNotFoundError} Se o bairro não existir.
   * @throws {DependencyError} Se o bairro tiver ecopontos ou assinantes vinculados.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(id: number): Promise<void> {
    await this.neighborhoodRepository.delete(id);
  }
}
