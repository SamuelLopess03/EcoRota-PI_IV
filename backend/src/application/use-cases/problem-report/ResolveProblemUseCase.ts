import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { ResolveProblemInputDTO, ResolveProblemOutputDTO } from "../../dtos/problem-report/ResolveProblemDTO.js";
import { ProblemStatus } from "../../../domain/value-objects/ProblemStatus.js";

/**
 * @class ResolveProblemUseCase
 * @description Caso de uso para que um administrador atualize o status de um problema.
 */
export class ResolveProblemUseCase {
  constructor(
    private problemReportRepository: ProblemReportRepository,
    private administratorRepository: AdministratorRepository
  ) { }

  /**
   * Executa o processo de resolução/atualização de status.
   * @param id ID do relato.
   * @param input Dados da resolução.
   * @throws {EntityNotFoundError} Se o relato ou admin não existirem.
   * @throws {InvalidProblemStatusError} Se o status for inválido.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number, input: ResolveProblemInputDTO): Promise<ResolveProblemOutputDTO> {
    await this.administratorRepository.findById(input.adminId);

    const newStatus = new ProblemStatus(input.status);
    
    const updatedReport = await this.problemReportRepository.updateStatus(id, newStatus, input.adminId);

    return {
      id: updatedReport.id,
      protocol: updatedReport.protocol.getValue(),
      attachments: updatedReport.attachments.getValues(),
      status: updatedReport.status.getValue(),
      description: updatedReport.description.getValue(),
      problemType: updatedReport.problemType.getValue(),
      createdAt: updatedReport.createdAt,
      updatedAt: updatedReport.updatedAt,
      subscriberId: updatedReport.subscriberId,
      resolvedByAdminId: updatedReport.resolvedByAdminId
    };
  }
}
