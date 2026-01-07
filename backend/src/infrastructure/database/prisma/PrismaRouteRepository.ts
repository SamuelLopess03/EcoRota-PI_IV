import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Route } from "../../../domain/entities/Route.js";
import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";

export class PrismaRouteRepository implements RouteRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Route, "id" | "created_at" | "updated_at">): Promise<Route> {
    const createdRoute = await this.prisma.route.create({
      data: {
        name: data.name,
        days_of_week: data.days_of_week,
        collection_type: data.collection_type,
        start_time: data.start_time,
        end_time: data.end_time,
        admin_id_created: data.admin_id_created,
        admin_id_updated: data.admin_id_updated,
      },
    });

    return new Route(
      createdRoute.id,
      createdRoute.name,
      createdRoute.days_of_week,
      createdRoute.collection_type,
      createdRoute.start_time,
      createdRoute.end_time,
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
      route.days_of_week,
      route.collection_type,
      route.start_time,
      route.end_time,
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
          route.days_of_week,
          route.collection_type,
          route.start_time,
          route.end_time,
          route.created_at,
          route.updated_at,
          route.admin_id_created,
          route.admin_id_updated
        )
    );
  }
}
