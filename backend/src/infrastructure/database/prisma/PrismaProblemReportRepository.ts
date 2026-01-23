import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { ProblemReport } from "../../../domain/entities/ProblemReport.js";
import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { ProblemDescription } from "../../../domain/value-objects/ProblemDescription.js";

export class PrismaProblemReportRepository implements ProblemReportRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<ProblemReport, "id" | "created_at" | "updated_at">): Promise<ProblemReport> {
    const createdProblem = await this.prisma.reportedProblem.create({
      data: {
        problem_type: data.problem_type,
        description: data.description.getValue(),
        status: data.status,
        url_attachments: data.url_attachments,
        protocol: data.protocol,
        subscriber_id: data.subscriber_id,
        resolved_by_admin_id: data.resolved_by_admin_id,
      },
    });

    return new ProblemReport(
      createdProblem.id,
      createdProblem.problem_type,
      new ProblemDescription(createdProblem.description),
      createdProblem.status,
      createdProblem.url_attachments,
      createdProblem.protocol,
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
      problem.problem_type,
      new ProblemDescription(problem.description),
      problem.status,
      problem.url_attachments,
      problem.protocol,
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
          problem.problem_type,
          new ProblemDescription(problem.description),
          problem.status,
          problem.url_attachments,
          problem.protocol,
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
          problem.problem_type,
          new ProblemDescription(problem.description),
          problem.status,
          problem.url_attachments,
          problem.protocol,
          problem.created_at,
          problem.updated_at,
          problem.subscriber_id,
          problem.resolved_by_admin_id
        )
    );
  }

  async updateStatus(id: number, status: string, resolvedByAdminId?: number): Promise<ProblemReport | null> {
    const updatedProblem = await this.prisma.reportedProblem.update({
      where: { id },
      data: {
        status,
        resolved_by_admin_id: resolvedByAdminId,
      },
    });

    if (!updatedProblem) return null;

    return new ProblemReport(
      updatedProblem.id,
      updatedProblem.problem_type,
      new ProblemDescription(updatedProblem.description),
      updatedProblem.status,
      updatedProblem.url_attachments,
      updatedProblem.protocol,
      updatedProblem.created_at,
      updatedProblem.updated_at,
      updatedProblem.subscriber_id,
      updatedProblem.resolved_by_admin_id
    );
  }
}
