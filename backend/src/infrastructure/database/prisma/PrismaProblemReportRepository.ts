import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { ProblemReport } from "../../../domain/entities/ProblemReport.js";
import { ProblemReportRepository } from "../../../domain/repositories/ProblemReportRepository.js";
import { ProblemProtocol } from "../../../domain/value-objects/ProblemProtocol.js";
import { ProblemAttachments } from "../../../domain/value-objects/ProblemAttachments.js";
import { ProblemStatus } from "../../../domain/value-objects/ProblemStatus.js";
import { ProblemDescription } from "../../../domain/value-objects/ProblemDescription.js";
import { ProblemType } from "../../../domain/value-objects/ProblemType.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";

export class PrismaProblemReportRepository implements ProblemReportRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: Omit<ProblemReport, "id" | "createdAt" | "updatedAt">): Promise<ProblemReport> {
    try {
      const createdProblem = await this.prisma.reportedProblem.create({
        data: {
          protocol: data.protocol.getValue(),
          url_attachments: data.attachments.serialize(),
          status: data.status.getValue(),
          description: data.description.getValue(),
          problem_type: data.problemType.getValue(),
          subscriber_id: data.subscriberId,
          resolved_by_admin_id: data.resolvedByAdminId,
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError(`Já existe um relato com o protocolo '${data.protocol.getValue()}'.`);
      }
      throw new PersistenceError(`Erro ao criar relato de problema: ${error.message}`);
    }
  }

  async findById(id: number): Promise<ProblemReport> {
    try {
      const problem = await this.prisma.reportedProblem.findUnique({
        where: { id },
      });

      if (!problem) {
        throw new EntityNotFoundError("Relato de Problema", id);
      }

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
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) throw error;
      throw new PersistenceError(`Erro ao buscar relato por ID: ${error.message}`);
    }
  }

  async findByProtocol(protocol: ProblemProtocol): Promise<ProblemReport | null> {
    try {
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
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar relato por protocolo: ${error.message}`);
    }
  }

  async findBySubscriberId(subscriberId: number): Promise<ProblemReport[]> {
    try {
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
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar relatos por assinante: ${error.message}`);
    }
  }

  async findAll(): Promise<ProblemReport[]> {
    try {
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
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar todos os relatos: ${error.message}`);
    }
  }

  async updateStatus(id: number, status: ProblemStatus, resolvedByAdminId?: number): Promise<ProblemReport> {
    try {
      const updatedProblem = await this.prisma.reportedProblem.update({
        where: { id },
        data: {
          status: status.getValue(),
          resolved_by_admin_id: resolvedByAdminId,
        },
      });

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
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Relato de Problema", id);
      }
      throw new PersistenceError(`Erro ao atualizar status do relato: ${error.message}`);
    }
  }

  async update(id: number, data: Partial<Omit<ProblemReport, "id" | "createdAt">>): Promise<ProblemReport> {
    try {
      const updatedProblem = await this.prisma.reportedProblem.update({
        where: { id },
        data: {
          protocol: data.protocol?.getValue(),
          url_attachments: data.attachments?.serialize(),
          status: data.status?.getValue(),
          description: data.description?.getValue(),
          problem_type: data.problemType?.getValue(),
          subscriber_id: data.subscriberId,
          resolved_by_admin_id: data.resolvedByAdminId,
        },
      });

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
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Relato de Problema", id);
      }
      if (error.code === 'P2002') {
        throw new ConflictError(`Já existe um relato com este protocolo.`);
      }
      throw new PersistenceError(`Erro ao atualizar relato: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.reportedProblem.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Relato de Problema", id);
      }
      throw new PersistenceError(`Erro ao deletar relato: ${error.message}`);
    }
  }
}
