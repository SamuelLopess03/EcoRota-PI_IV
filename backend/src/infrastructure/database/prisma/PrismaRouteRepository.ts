import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Route } from "../../../domain/entities/Route.js";
import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";

export class PrismaRouteRepository implements RouteRepository {
  constructor(private prisma: PrismaClient) {}

  private parseCollectionTime(timeString: string): CollectionTime {
    const [startTime, endTime] = timeString.split(" - ");
    return new CollectionTime(startTime.trim(), endTime.trim());
  }

  async create(data: Omit<Route, "id" | "created_at" | "updated_at">): Promise<Route> {
    const createdRoute = await this.prisma.route.create({
      data: {
        name: data.name,
        collection_days: data.collection_days.toString(),
        collection_type: data.collection_type,
        collection_time: data.collection_time.getFormattedInterval(),
        admin_id_created: data.admin_id_created,
        admin_id_updated: data.admin_id_updated,
      },
    });

    return new Route(
      createdRoute.id,
      createdRoute.name,
      CollectionDays.fromString(createdRoute.collection_days),
      createdRoute.collection_type,
      this.parseCollectionTime(createdRoute.collection_time),
      createdRoute.created_at,
      createdRoute.updated_at,
      createdRoute.admin_id_created,
      createdRoute.admin_id_updated
    );
  }

  async findById(id: number): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { id },
    });

    if (!route) return null;

    return new Route(
      route.id,
      route.name,
      CollectionDays.fromString(route.collection_days),
      route.collection_type,
      this.parseCollectionTime(route.collection_time),
      route.created_at,
      route.updated_at,
      route.admin_id_created,
      route.admin_id_updated
    );
  }

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany();

    return routes.map(
      (route) =>
        new Route(
          route.id,
          route.name,
          CollectionDays.fromString(route.collection_days),
          route.collection_type,
          this.parseCollectionTime(route.collection_time),
          route.created_at,
          route.updated_at,
          route.admin_id_created,
          route.admin_id_updated
        )
    );
  }
}
