import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { UpdateProblemReportInputDTO, UpdateProblemReportOutputDTO } from "../../dtos/problem-report/UpdateProblemReportDTO.js";
import { ProblemDescription } from "../../../domain/value-objects/ProblemDescription.js";
import { ProblemAttachments } from "../../../domain/value-objects/ProblemAttachments.js";
import { ProblemType } from "../../../domain/value-objects/ProblemType.js";
import { ProblemJustification } from "../../../domain/value-objects/ProblemJustification.js";

/**
 * @class UpdateProblemReportUseCase
 * @description Caso de uso para atualização de dados de um relato.
 */
export class UpdateProblemReportUseCase {
  constructor(
    private problemReportRepository: ProblemReportRepository,
    private subscriberRepository: SubscriberRepository
  ) { }

  /**
   * Executa a atualização.
   * @param id ID do relato.
   * @param input Dados para atualização.
   * @throws {EntityNotFoundError} Se o relato ou assinante não existir.
   * @throws {InvalidProblemDescriptionError} Se a descrição for inválida.
   * @throws {InvalidProblemAttachmentsError} Se os anexos forem inválidos.
   * @throws {InvalidProblemTypeError} Se o tipo de problema for inválido.
   * @throws {InvalidProblemJustificationError} Se a justificativa for inválida.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number, input: UpdateProblemReportInputDTO): Promise<UpdateProblemReportOutputDTO> {
    if (input.subscriberId) {
      await this.subscriberRepository.findById(input.subscriberId);
    }

    const dataToUpdate: any = {};

    if (input.description) dataToUpdate.description = new ProblemDescription(input.description);
    if (input.problemType) dataToUpdate.problemType = new ProblemType(input.problemType);
    if (input.attachments) dataToUpdate.attachments = new ProblemAttachments(input.attachments);
    if (input.justification) dataToUpdate.justification = new ProblemJustification(input.justification);
    if (input.subscriberId) dataToUpdate.subscriberId = input.subscriberId;

    const updatedReport = await this.problemReportRepository.update(id, dataToUpdate);

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
      resolvedByAdminId: updatedReport.resolvedByAdminId,
      justification: updatedReport.justification ? updatedReport.justification.getValue() : null
    };
  }
}
