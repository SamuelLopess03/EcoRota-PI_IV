import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Neighborhood } from "../../../domain/entities/Neighborhood.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

export class PrismaNeighborhoodRepository implements NeighborhoodRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Omit<Neighborhood, "id" | "created_at" | "updated_at">): Promise<Neighborhood> {
        const createdNeighborhood = await this.prisma.neighborhood.create({
            data: {
                name: data.name,
                cep: data.postalCode.getValue(),
                latitude: data.geoLocation.getLatitude(),
                longitude: data.geoLocation.getLongitude(),
                population_estimate: data.population_estimate,
                route_id: data.route_id,
                admin_id_created: data.admin_id_created,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Neighborhood(
            createdNeighborhood.id,
            createdNeighborhood.name,
            new PostalCode(createdNeighborhood.cep),
            new GeoLocation(createdNeighborhood.latitude, createdNeighborhood.longitude),
            createdNeighborhood.population_estimate,
            createdNeighborhood.created_at,
            createdNeighborhood.updated_at,
            createdNeighborhood.route_id,
            createdNeighborhood.admin_id_created,
            createdNeighborhood.admin_id_updated
        );
    }

    async findById(id: number): Promise<Neighborhood | null> {
        const neighborhood = await this.prisma.neighborhood.findUnique({
            where: { id },
        });

        if (!neighborhood) return null;

        return new Neighborhood(
            neighborhood.id,
            neighborhood.name,
            new PostalCode(neighborhood.cep),
            new GeoLocation(neighborhood.latitude, neighborhood.longitude),
            neighborhood.population_estimate,
            neighborhood.created_at,
            neighborhood.updated_at,
            neighborhood.route_id,
            neighborhood.admin_id_created,
            neighborhood.admin_id_updated
        );
    }

    async findAll(): Promise<Neighborhood[]> {
        const neighborhoods = await this.prisma.neighborhood.findMany();

        return neighborhoods.map(
            (neighborhood) =>
                new Neighborhood(
                    neighborhood.id,
                    neighborhood.name,
                    new PostalCode(neighborhood.cep),
                    new GeoLocation(neighborhood.latitude, neighborhood.longitude),
                    neighborhood.population_estimate,
                    neighborhood.created_at,
                    neighborhood.updated_at,
                    neighborhood.route_id,
                    neighborhood.admin_id_created,
                    neighborhood.admin_id_updated
                )
        );
    }

    async findByRouteId(routeId: number): Promise<Neighborhood[]> {
        const neighborhoods = await this.prisma.neighborhood.findMany({
            where: { route_id: routeId },
        });

        return neighborhoods.map(
            (neighborhood) =>
                new Neighborhood(
                    neighborhood.id,
                    neighborhood.name,
                    new PostalCode(neighborhood.cep),
                    new GeoLocation(neighborhood.latitude, neighborhood.longitude),
                    neighborhood.population_estimate,
                    neighborhood.created_at,
                    neighborhood.updated_at,
                    neighborhood.route_id,
                    neighborhood.admin_id_created,
                    neighborhood.admin_id_updated
                )
        );
    }

    async update(id: number, data: Partial<Omit<Neighborhood, "id" | "created_at">>): Promise<Neighborhood> {
        const updatedNeighborhood = await this.prisma.neighborhood.update({
            where: { id },
            data: {
                name: data.name,
                cep: data.postalCode?.getValue(),
                latitude: data.geoLocation?.getLatitude(),
                longitude: data.geoLocation?.getLongitude(),
                population_estimate: data.population_estimate,
                route_id: data.route_id,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Neighborhood(
            updatedNeighborhood.id,
            updatedNeighborhood.name,
            new PostalCode(updatedNeighborhood.cep),
            new GeoLocation(updatedNeighborhood.latitude, updatedNeighborhood.longitude),
            updatedNeighborhood.population_estimate,
            updatedNeighborhood.created_at,
            updatedNeighborhood.updated_at,
            updatedNeighborhood.route_id,
            updatedNeighborhood.admin_id_created,
            updatedNeighborhood.admin_id_updated
        );
    }

    async delete(id: number): Promise<void> {
        await this.prisma.neighborhood.delete({
            where: { id },
        });
    }
}
