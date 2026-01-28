import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";

/**
 * @class DeleteProblemReportUseCase
 * @description Caso de uso para remoção de um relato.
 */
export class DeleteProblemReportUseCase {
  constructor(private problemReportRepository: ProblemReportRepository) { }

  /**
   * Executa a remoção.
   * @param id ID do relato.
   * @throws {EntityNotFoundError} Se o relato não for encontrado.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(id: number): Promise<void> {
    await this.problemReportRepository.delete(id);
  }
}
