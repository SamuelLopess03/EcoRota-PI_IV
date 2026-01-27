import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { ReportProblemInputDTO, ReportProblemOutputDTO } from "../../dtos/problem-report/ReportProblemDTO.js";
import { ProblemProtocol } from "../../../domain/value-objects/ProblemProtocol.js";
import { ProblemStatus } from "../../../domain/value-objects/ProblemStatus.js";
import { ProblemDescription } from "../../../domain/value-objects/ProblemDescription.js";
import { ProblemAttachments } from "../../../domain/value-objects/ProblemAttachments.js";
import { ProblemType } from "../../../domain/value-objects/ProblemType.js";

/**
 * @class ReportProblemUseCase
 * @description Caso de uso responsável por permitir que um cidadão registre um problema.
 */
export class ReportProblemUseCase {
  constructor(
    private problemReportRepository: ProblemReportRepository,
    private subscriberRepository: SubscriberRepository
  ) { }

  /**
   * Executa o registro do problema.
   * @param input Dados do relato.
   * @returns DTO com os dados do relato criado.
   * @throws {EntityNotFoundError} Se o assinante não existir.
   * @throws {InvalidDescriptionError} Se a descrição for inválida.
   * @throws {InvalidProblemTypeError} Se o tipo de problema for inválido.
   * @throws {InvalidProblemDescriptionError} Se a descrição for inválida.
   * @throws {InvalidProblemProtocolError} Se o protocolo for inválido.
   * @throws {InvalidProblemAttachmentsError} Se os anexos forem inválidos.
   * @throws {InvalidProblemStatusError} Se o status for inválido.
   * @throws {ConflictError} Se o protocolo já existir.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(input: ReportProblemInputDTO): Promise<ReportProblemOutputDTO> {
    await this.subscriberRepository.findById(input.subscriberId);

    const currentYear = new Date().getFullYear();
    const allReports = await this.problemReportRepository.findAll();
    const reportsInYear = allReports.filter(r => r.createdAt.getFullYear() === currentYear);
    const protocol = ProblemProtocol.generate(currentYear, reportsInYear.length + 1);

    const description = new ProblemDescription(input.description);
    const problemType = new ProblemType(input.problemType);
    const attachments = new ProblemAttachments(input.attachments);
    const status = new ProblemStatus("PENDING");

    const report = await this.problemReportRepository.create({
      protocol,
      attachments,
      status,
      description,
      problemType,
      subscriberId: input.subscriberId,
      resolvedByAdminId: null
    });

    return {
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
    };
  }
}
