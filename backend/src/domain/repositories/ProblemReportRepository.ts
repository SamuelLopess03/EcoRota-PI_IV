import { ProblemReport } from "../entities/ProblemReport.js";
import { ProblemStatus } from "../value-objects/ProblemStatus.js";

export interface ProblemReportRepository {
  create(data: Omit<ProblemReport, "id" | "created_at" | "updated_at">): Promise<ProblemReport>;
  findById(id: number): Promise<ProblemReport | null>;
  findBySubscriberId(subscriberId: number): Promise<ProblemReport[]>;
  findAll(): Promise<ProblemReport[]>;
  updateStatus(id: number, status: ProblemStatus, resolvedByAdminId?: number): Promise<ProblemReport | null>;
}
