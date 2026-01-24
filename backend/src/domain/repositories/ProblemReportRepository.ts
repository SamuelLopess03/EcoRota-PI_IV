import { ProblemReport } from "../entities/ProblemReport.js";
import { ProblemStatus } from "../value-objects/ProblemStatus.js";
import { ProblemProtocol } from "../value-objects/ProblemProtocol.js";

export interface ProblemReportRepository {
  create(data: Omit<ProblemReport, "id" | "createdAt" | "updatedAt">): Promise<ProblemReport>;
  findById(id: number): Promise<ProblemReport | null>;
  findByProtocol(protocol: ProblemProtocol): Promise<ProblemReport | null>;
  findBySubscriberId(subscriberId: number): Promise<ProblemReport[]>;
  findAll(): Promise<ProblemReport[]>;
  update(id: number, data: Partial<Omit<ProblemReport, "id" | "createdAt">>): Promise<ProblemReport>;
  updateStatus(id: number, status: ProblemStatus, resolvedByAdminId?: number): Promise<ProblemReport | null>;
  delete(id: number): Promise<void>;
}
