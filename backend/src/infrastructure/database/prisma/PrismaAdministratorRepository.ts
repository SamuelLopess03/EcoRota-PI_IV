import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Administrator } from "../../../domain/entities/Administrator.js";
import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";

export class PrismaAdministratorRepository implements AdministratorRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Administrator, "id" | "creation_date" | "update_date">): Promise<Administrator> {
    const createdAdmin = await this.prisma.administrador.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || "",
      },
    });

    return new Administrator(
      createdAdmin.id,
      createdAdmin.name,
      createdAdmin.email,
      createdAdmin.password,
      createdAdmin.creation_date,
      createdAdmin.update_date
    );
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const admin = await this.prisma.administrador.findUnique({
      where: { email },
    });

    if (!admin) return null;

    return new Administrator(
      admin.id,
      admin.name,
      admin.email,
      admin.password,
      admin.creation_date,
      admin.update_date
    );
  }

  async findById(id: number): Promise<Administrator | null> {
    const admin = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!admin) return null;

    return new Administrator(
      admin.id,
      admin.name,
      admin.email,
      admin.password,
      admin.creation_date,
      admin.update_date
    );
  }
}