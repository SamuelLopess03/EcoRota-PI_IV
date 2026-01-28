import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Route } from "../../../domain/entities/Route.js";
import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";
import { CollectionType } from "../../../domain/value-objects/CollectionType.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";
import { DependencyError } from "../../../domain/errors/persistence/DependencyError.js";

export class PrismaRouteRepository implements RouteRepository {
  constructor(private prisma: PrismaClient) { }

  private parseCollectionTime(timeString: string): CollectionTime {
    const [startTime, endTime] = timeString.split(" - ");
    return new CollectionTime(startTime.trim(), endTime.trim());
  }

  async create(data: Omit<Route, "id" | "createdAt" | "updatedAt">): Promise<Route> {
    try {
      const createdRoute = await this.prisma.route.create({
        data: {
          name: data.name,
          collection_days: data.collectionDays.toString(),
          collection_time: data.collectionTime.getFormattedInterval(),
          collection_type: data.collectionType.getValue(),
          admin_id_created: data.adminIdCreated,
          admin_id_updated: data.adminIdUpdated,
        },
      });

      return new Route(
        createdRoute.id,
        createdRoute.name,
        CollectionDays.fromString(createdRoute.collection_days),
        this.parseCollectionTime(createdRoute.collection_time),
        new CollectionType(createdRoute.collection_type),
        createdRoute.created_at,
        createdRoute.updated_at,
        createdRoute.admin_id_created,
        createdRoute.admin_id_updated
      );
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError(`Rota com nome '${data.name}' já existe.`);
      }
      throw new PersistenceError(`Erro ao criar rota: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Route> {
    try {
      const route = await this.prisma.route.findUnique({
        where: { id },
      });

      if (!route) {
        throw new EntityNotFoundError("Rota", id);
      }

      return new Route(
        route.id,
        route.name,
        CollectionDays.fromString(route.collection_days),
        this.parseCollectionTime(route.collection_time),
        new CollectionType(route.collection_type),
        route.created_at,
        route.updated_at,
        route.admin_id_created,
        route.admin_id_updated
      );
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) throw error;
      throw new PersistenceError(`Erro ao buscar rota por ID: ${error.message}`);
    }
  }

  async findAll(): Promise<Route[]> {
    try {
      const routes = await this.prisma.route.findMany();

      return routes.map(
        (route) =>
          new Route(
            route.id,
            route.name,
            CollectionDays.fromString(route.collection_days),
            this.parseCollectionTime(route.collection_time),
            new CollectionType(route.collection_type),
            route.created_at,
            route.updated_at,
            route.admin_id_created,
            route.admin_id_updated
          )
      );
    } catch (error: any) {
      throw new PersistenceError(`Erro ao buscar todas as rotas: ${error.message}`);
    }
  }

  async update(id: number, data: Partial<Omit<Route, "id" | "createdAt">>): Promise<Route> {
    try {
      const updatedRoute = await this.prisma.route.update({
        where: { id },
        data: {
          name: data.name,
          collection_days: data.collectionDays?.toString(),
          collection_time: data.collectionTime?.getFormattedInterval(),
          collection_type: data.collectionType?.getValue(),
          admin_id_updated: data.adminIdUpdated,
        },
      });

      return new Route(
        updatedRoute.id,
        updatedRoute.name,
        CollectionDays.fromString(updatedRoute.collection_days),
        this.parseCollectionTime(updatedRoute.collection_time),
        new CollectionType(updatedRoute.collection_type),
        updatedRoute.created_at,
        updatedRoute.updated_at,
        updatedRoute.admin_id_created,
        updatedRoute.admin_id_updated
      );
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Rota", id);
      }
      if (error.code === 'P2002') {
        throw new ConflictError(`Já existe uma rota com este nome.`);
      }
      throw new PersistenceError(`Erro ao atualizar rota: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.route.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new EntityNotFoundError("Rota", id);
      }
      if (error.code === 'P2003') {
        throw new DependencyError("Não é possível excluir esta rota pois existem bairros vinculados a ela.");
      }
      throw new PersistenceError(`Erro ao deletar rota: ${error.message}`);
    }
  }
}
