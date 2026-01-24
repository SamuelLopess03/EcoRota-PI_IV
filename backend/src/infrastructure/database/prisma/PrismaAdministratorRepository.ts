import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Administrator } from "../../../domain/entities/Administrator.js";
import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { Email } from "../../../domain/value-objects/Email.js";

export class PrismaAdministratorRepository implements AdministratorRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: Omit<Administrator, "id" | "creation_date" | "update_date">): Promise<Administrator> {
    const createdAdmin = await this.prisma.administrador.create({
      data: {
        name: data.name,
        email: data.email.getValue(),
        password: data.password || "",
      },
    });

    return new Administrator(
      createdAdmin.id,
      createdAdmin.name,
      new Email(createdAdmin.email),
      createdAdmin.password,
      createdAdmin.creation_date,
      createdAdmin.update_date
    );
  }

  async findByEmail(email: Email): Promise<Administrator | null> {
    const admin = await this.prisma.administrador.findUnique({
      where: { email: email.getValue() },
    });

    if (!admin) return null;

    return new Administrator(
      admin.id,
      admin.name,
      new Email(admin.email),
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
      new Email(admin.email),
      admin.password,
      admin.creation_date,
      admin.update_date
    );
  }

  async findAll(): Promise<Administrator[]> {
    const admins = await this.prisma.administrador.findMany();

    return admins.map(
      (admin) =>
        new Administrator(
          admin.id,
          admin.name,
          new Email(admin.email),
          admin.password,
          admin.creation_date,
          admin.update_date
        )
    );
  }

  async update(id: number, data: Partial<Omit<Administrator, "id" | "creation_date">>): Promise<Administrator> {
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
      updatedAdmin.creation_date,
      updatedAdmin.update_date
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.administrador.delete({
      where: { id },
    });
  }
}