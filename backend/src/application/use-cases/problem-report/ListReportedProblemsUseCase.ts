import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { ListProblemReportsOutputDTO } from "../../dtos/problem-report/ListProblemReportsDTO.js";
import { ProblemProtocol } from "../../../domain/value-objects/ProblemProtocol.js";
import { ProblemReport } from "../../../domain/entities/ProblemReport.js";

/**
 * @class ListReportedProblemsUseCase
 * @description Caso de uso para listar relatos de problemas.
 */
export class ListReportedProblemsUseCase {
  constructor(private problemReportRepository: ProblemReportRepository) { }

  /**
   * Executa a listagem com otimização por filtros.
   * @param filters Filtros opcionais (protocolo, status ou subscriberId).
   * @returns Lista de relatos de problemas.
   * @throws {InvalidProblemProtocolError} Se o protocolo for inválido.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(filters?: { protocol?: string, status?: string, subscriberId?: number }): Promise<ListProblemReportsOutputDTO[]> {
    let reports: ProblemReport[] = [];

    if (filters?.protocol) {
      const protocolVO = new ProblemProtocol(filters.protocol);
      const report = await this.problemReportRepository.findByProtocol(protocolVO);
      reports = report ? [report] : [];
    } else if (filters?.subscriberId) {
      reports = await this.problemReportRepository.findBySubscriberId(filters.subscriberId);
    } else {
      reports = await this.problemReportRepository.findAll();
    }

    if (filters?.status && !filters.protocol) {
      reports = reports.filter(r => r.status.getValue() === filters.status);
    }

    return reports.map(report => ({
      id: report.id,
      protocol: report.protocol.getValue(),
      attachments: report.attachments.getValues(),
      status: report.status.getValue(),
      description: report.description.getValue(),
      problemType: report.problemType.getValue(),
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      subscriberId: report.subscriberId,
      resolvedByAdminId: report.resolvedByAdminId
    }));
  }
}
