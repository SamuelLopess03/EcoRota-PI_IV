import { ProblemReport } from "../entities/ProblemReport.js";
import { ProblemStatus } from "../value-objects/ProblemStatus.js";
import { ProblemProtocol } from "../value-objects/ProblemProtocol.js";
import { ProblemJustification } from "../value-objects/ProblemJustification.js";

export interface ProblemReportRepository {
  /**
   * @throws {ConflictError} Se houver conflito de protocolo.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  create(data: Omit<ProblemReport, "id" | "createdAt" | "updatedAt" | "justification">): Promise<ProblemReport>;
  
  /**
   * @throws {EntityNotFoundError} Se o relato não for encontrado pelo ID.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findById(id: number): Promise<ProblemReport>;
  
  /**
   * Retorna null se o relato de problema não for encontrado pelo protocolo.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findByProtocol(protocol: ProblemProtocol): Promise<ProblemReport | null>;
  
  /**
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findBySubscriberId(subscriberId: number): Promise<ProblemReport[]>;
  
  /**
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  findAll(): Promise<ProblemReport[]>;
  
  /**
   * @throws {EntityNotFoundError} Se o relato não existir para atualização.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  update(id: number, data: Partial<Omit<ProblemReport, "id" | "createdAt">>): Promise<ProblemReport>;
  
  /**
   * @throws {EntityNotFoundError} Se o relato não existir para atualização de status.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  updateStatus(id: number, status: ProblemStatus, resolvedByAdminId?: number, justification?: ProblemJustification): Promise<ProblemReport>;
  
  /**
   * @throws {EntityNotFoundError} Se o relato não existir para deleção.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  delete(id: number): Promise<void>;
}
