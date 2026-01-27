import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Administrator } from "../../../domain/entities/Administrator.js";
import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";

export class PrismaAdministratorRepository implements AdministratorRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: Omit<Administrator, "id" | "createdAt" | "updatedAt">): Promise<Administrator> {
    try {
      const createdAdmin = await this.prisma.administrador.create({
        data: {
          name: data.name,
          email: data.email.getValue(),
          password: data.password,
        },
      });

      return new Administrator(
        createdAdmin.id,
        createdAdmin.name,
        new Email(createdAdmin.email),
        createdAdmin.password,
        createdAdmin.created_at,
        createdAdmin.updated_at
      );
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError(`Administrador com e-mail '${data.email.getValue()}' já existe.`);
      }
      throw new PersistenceError(`Erro ao criar administrador: ${error.message}`);
    }
  }

  async findByEmail(email: Email): Promise<Administrator | null> {
    try {
      const admin = await this.prisma.administrador.findUnique({
        where: { email: email.getValue() },
      });

      if (!admin) return null;

      return new Administrator(
        admin.id,
        admin.name,
        new Email(admin.email),
        admin.password,
        admin.created_at,
        admin.updated_at
      );
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar administrador por e-mail: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Administrator> {
    try {
      const admin = await this.prisma.administrador.findUnique({
        where: { id },
      });

      if (!admin) {
        throw new EntityNotFoundError("Administrador", id);
      }

      return new Administrator(
        admin.id,
        admin.name,
        new Email(admin.email),
        admin.password,
        admin.created_at,
        admin.updated_at
      );
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) throw error;
      throw new PersistenceError(`Erro ao buscar administrador por ID: ${error.message}`);
    }
  }

  async findAll(): Promise<Administrator[]> {
    try {
      const admins = await this.prisma.administrador.findMany();

      return admins.map(
        (admin) =>
          new Administrator(
            admin.id,
            admin.name,
            new Email(admin.email),
            admin.password,
            admin.created_at,
            admin.updated_at
          )
      );
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar todos os administradores: ${error.message}`);
    }
  }

  async update(id: number, data: Partial<Omit<Administrator, "id" | "createdAt">>): Promise<Administrator> {
    try {
      const updatedAdmin = await this.prisma.administrador.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email?.getValue(),
          password: data.password,
        },
      });

      return new Administrator(
        updatedAdmin.id,
        updatedAdmin.name,
        new Email(updatedAdmin.email),
        updatedAdmin.password,
        updatedAdmin.created_at,
        updatedAdmin.updated_at
      );
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Administrador", id);
      }
      if (error.code === 'P2002') {
        throw new ConflictError(`Já existe um administrador com este e-mail.`);
      }
      throw new PersistenceError(`Erro ao atualizar administrador: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.administrador.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Administrador", id);
      }
      throw new PersistenceError(`Erro ao deletar administrador: ${error.message}`);
    }
  }
}
