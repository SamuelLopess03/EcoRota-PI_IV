import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { ProblemReport } from "../../../domain/entities/ProblemReport.js";
import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { ProblemProtocol } from "../../../domain/value-objects/ProblemProtocol.js";
import { ProblemAttachments } from "../../../domain/value-objects/ProblemAttachments.js";
import { ProblemStatus } from "../../../domain/value-objects/ProblemStatus.js";
import { ProblemDescription } from "../../../domain/value-objects/ProblemDescription.js";
import { ProblemType } from "../../../domain/value-objects/ProblemType.js";

export class PrismaProblemReportRepository implements ProblemReportRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: Omit<ProblemReport, "id" | "created_at" | "updated_at">): Promise<ProblemReport> {
    const createdProblem = await this.prisma.reportedProblem.create({
      data: {
        protocol: data.protocol.getValue(),
        url_attachments: data.attachments.serialize(),
        status: data.status.getValue(),
        description: data.description.getValue(),
        problem_type: data.problemType.getValue(),
        subscriber_id: data.subscriber_id,
        resolved_by_admin_id: data.resolved_by_admin_id,
      },
    });

    return new ProblemReport(
      createdProblem.id,
      new ProblemProtocol(createdProblem.protocol),
      new ProblemAttachments(createdProblem.url_attachments),
      new ProblemStatus(createdProblem.status),
      new ProblemDescription(createdProblem.description),
      new ProblemType(createdProblem.problem_type),
      createdProblem.created_at,
      createdProblem.updated_at,
      createdProblem.subscriber_id,
      createdProblem.resolved_by_admin_id
    );
  }

  async findById(id: number): Promise<ProblemReport | null> {
    const problem = await this.prisma.reportedProblem.findUnique({
      where: { id },
    });

    if (!problem) return null;

    return new ProblemReport(
      problem.id,
      new ProblemProtocol(problem.protocol),
      new ProblemAttachments(problem.url_attachments),
      new ProblemStatus(problem.status),
      new ProblemDescription(problem.description),
      new ProblemType(problem.problem_type),
      problem.created_at,
      problem.updated_at,
      problem.subscriber_id,
      problem.resolved_by_admin_id
    );
  }

  async findByProtocol(protocol: ProblemProtocol): Promise<ProblemReport | null> {
    const problem = await this.prisma.reportedProblem.findFirst({
      where: { protocol: protocol.getValue() },
    });

    if (!problem) return null;

    return new ProblemReport(
      problem.id,
      new ProblemProtocol(problem.protocol),
      new ProblemAttachments(problem.url_attachments),
      new ProblemStatus(problem.status),
      new ProblemDescription(problem.description),
      new ProblemType(problem.problem_type),
      problem.created_at,
      problem.updated_at,
      problem.subscriber_id,
      problem.resolved_by_admin_id
    );
  }

  async findBySubscriberId(subscriberId: number): Promise<ProblemReport[]> {
    const problems = await this.prisma.reportedProblem.findMany({
      where: { subscriber_id: subscriberId },
    });

    return problems.map(
      (problem) =>
        new ProblemReport(
          problem.id,
          new ProblemProtocol(problem.protocol),
          new ProblemAttachments(problem.url_attachments),
          new ProblemStatus(problem.status),
          new ProblemDescription(problem.description),
          new ProblemType(problem.problem_type),
          problem.created_at,
          problem.updated_at,
          problem.subscriber_id,
          problem.resolved_by_admin_id
        )
    );
  }

  async findAll(): Promise<ProblemReport[]> {
    const problems = await this.prisma.reportedProblem.findMany();

    return problems.map(
      (problem) =>
        new ProblemReport(
          problem.id,
          new ProblemProtocol(problem.protocol),
          new ProblemAttachments(problem.url_attachments),
          new ProblemStatus(problem.status),
          new ProblemDescription(problem.description),
          new ProblemType(problem.problem_type),
          problem.created_at,
          problem.updated_at,
          problem.subscriber_id,
          problem.resolved_by_admin_id
        )
    );
  }

  async updateStatus(id: number, status: ProblemStatus, resolvedByAdminId?: number): Promise<ProblemReport | null> {
    const updatedProblem = await this.prisma.reportedProblem.update({
      where: { id },
      data: {
        status: status.getValue(),
        resolved_by_admin_id: resolvedByAdminId,
      },
    });

    if (!updatedProblem) return null;

    return new ProblemReport(
      updatedProblem.id,
      new ProblemProtocol(updatedProblem.protocol),
      new ProblemAttachments(updatedProblem.url_attachments),
      new ProblemStatus(updatedProblem.status),
      new ProblemDescription(updatedProblem.description),
      new ProblemType(updatedProblem.problem_type),
      updatedProblem.created_at,
      updatedProblem.updated_at,
      updatedProblem.subscriber_id,
      updatedProblem.resolved_by_admin_id
    );
  }
}
