import { PrismaClient } from "@prisma/client";
import { Neighborhood } from "../../../domain/entities/Neighborhood.js";
import { NeighborhoodRepository } from "../../../domain/repositories/NeighborhoodRepository.js";
import { PopulationEstimate } from "../../../domain/value-objects/PopulationEstimate.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";
import { DependencyError } from "../../../domain/errors/persistence/DependencyError.js";

export class PrismaNeighborhoodRepository implements NeighborhoodRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Omit<Neighborhood, "id" | "createdAt" | "updatedAt">): Promise<Neighborhood> {
        try {
            const createdNeighborhood = await this.prisma.neighborhood.create({
                data: {
                    name: data.name,
                    population_estimate: data.populationEstimate.getValue(),
                    cep: data.postalCode.getValue(),
                    latitude: data.geoLocation.getLatitude(),
                    longitude: data.geoLocation.getLongitude(),
                    route_id: data.routeId,
                    admin_id_created: data.adminIdCreated,
                    admin_id_updated: data.adminIdUpdated,
                },
            });

            return new Neighborhood(
                createdNeighborhood.id,
                createdNeighborhood.name,
                new PopulationEstimate(createdNeighborhood.population_estimate),
                new PostalCode(createdNeighborhood.cep),
                new GeoLocation(createdNeighborhood.latitude, createdNeighborhood.longitude),
                createdNeighborhood.created_at,
                createdNeighborhood.updated_at,
                createdNeighborhood.route_id,
                createdNeighborhood.admin_id_created,
                createdNeighborhood.admin_id_updated
            );
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictError(`Bairro com nome ou localização conflitante já existe.`);
            }
            throw new PersistenceError(`Erro ao criar bairro: ${error.message}`);
        }
    }

    async findById(id: number): Promise<Neighborhood> {
        try {
            const neighborhood = await this.prisma.neighborhood.findUnique({
                where: { id },
            });

            if (!neighborhood) {
                throw new EntityNotFoundError("Bairro", id);
            }

            return new Neighborhood(
                neighborhood.id,
                neighborhood.name,
                new PopulationEstimate(neighborhood.population_estimate),
                new PostalCode(neighborhood.cep),
                new GeoLocation(neighborhood.latitude, neighborhood.longitude),
                neighborhood.created_at,
                neighborhood.updated_at,
                neighborhood.route_id,
                neighborhood.admin_id_created,
                neighborhood.admin_id_updated
            );
        } catch (error: any) {
            if (error instanceof EntityNotFoundError) throw error;
            throw new PersistenceError(`Erro ao buscar bairro por ID: ${error.message}`);
        }
    }

    async findAll(): Promise<Neighborhood[]> {
        try {
            const neighborhoods = await this.prisma.neighborhood.findMany();

            return neighborhoods.map(
                (neighborhood) =>
                    new Neighborhood(
                        neighborhood.id,
                        neighborhood.name,
                        new PopulationEstimate(neighborhood.population_estimate),
                        new PostalCode(neighborhood.cep),
                        new GeoLocation(neighborhood.latitude, neighborhood.longitude),
                        neighborhood.created_at,
                        neighborhood.updated_at,
                        neighborhood.route_id,
                        neighborhood.admin_id_created,
                        neighborhood.admin_id_updated
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar todos os bairros: ${error.message}`);
        }
    }

    async findByRouteId(routeId: number): Promise<Neighborhood[]> {
        try {
            const neighborhoods = await this.prisma.neighborhood.findMany({
                where: { route_id: routeId },
            });

            return neighborhoods.map(
                (neighborhood) =>
                    new Neighborhood(
                        neighborhood.id,
                        neighborhood.name,
                        new PopulationEstimate(neighborhood.population_estimate),
                        new PostalCode(neighborhood.cep),
                        new GeoLocation(neighborhood.latitude, neighborhood.longitude),
                        neighborhood.created_at,
                        neighborhood.updated_at,
                        neighborhood.route_id,
                        neighborhood.admin_id_created,
                        neighborhood.admin_id_updated
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar bairros por rota: ${error.message}`);
        }
    }

    async update(id: number, data: Partial<Omit<Neighborhood, "id" | "createdAt">>): Promise<Neighborhood> {
        try {
            const updatedNeighborhood = await this.prisma.neighborhood.update({
                where: { id },
                data: {
                    name: data.name,
                    population_estimate: data.populationEstimate?.getValue(),
                    cep: data.postalCode?.getValue(),
                    latitude: data.geoLocation?.getLatitude(),
                    longitude: data.geoLocation?.getLongitude(),
                    route_id: data.routeId,
                    admin_id_updated: data.adminIdUpdated,
                },
            });

            return new Neighborhood(
                updatedNeighborhood.id,
                updatedNeighborhood.name,
                new PopulationEstimate(updatedNeighborhood.population_estimate),
                new PostalCode(updatedNeighborhood.cep),
                new GeoLocation(updatedNeighborhood.latitude, updatedNeighborhood.longitude),
                updatedNeighborhood.created_at,
                updatedNeighborhood.updated_at,
                updatedNeighborhood.route_id,
                updatedNeighborhood.admin_id_created,
                updatedNeighborhood.admin_id_updated
            );
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Bairro", id);
            }
            if (error.code === 'P2002') {
                throw new ConflictError(`Já existe um bairro com estes dados.`);
            }
            throw new PersistenceError(`Erro ao atualizar bairro: ${error.message}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.neighborhood.delete({
                where: { id },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Bairro", id);
            }
            if (error.code === 'P2003') {
                throw new DependencyError("Não é possível excluir este bairro pois existem ecopontos ou inscritos vinculados a ele.");
            }
            throw new PersistenceError(`Erro ao deletar bairro: ${error.message}`);
        }
    }
}
