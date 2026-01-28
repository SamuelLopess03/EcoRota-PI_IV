import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";

/**
 * @class DeleteEcopointUseCase
 * @description Caso de uso responsável pela remoção de um ecoponto.
 */
export class DeleteEcopointUseCase {
  constructor(private ecopointRepository: EcopointRepository) { }

  /**
   * Executa a remoção do ecoponto.
   * @param id ID do ecoponto.
   * @throws {EntityNotFoundError} Se o ecoponto não existir.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number): Promise<void> {
    await this.ecopointRepository.delete(id);
  }
}
