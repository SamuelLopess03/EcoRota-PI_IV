import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Ecopoint } from "../../../domain/entities/Ecopoint.js";
import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";

export class PrismaEcopointRepository implements EcopointRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Omit<Ecopoint, "id" | "created_at" | "updated_at">): Promise<Ecopoint> {
        const createdEcopoint = await this.prisma.ecopoint.create({
            data: {
                name: data.name,
                address: data.address,
                accepted_materials: data.accepted_materials,
                collection_days: data.collection_days,
                collection_time: data.collection_time,
                neighborhood_id: data.neighborhood_id,
                admin_id_created: data.admin_id_created,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Ecopoint(
            createdEcopoint.id,
            createdEcopoint.name,
            createdEcopoint.address,
            createdEcopoint.accepted_materials,
            createdEcopoint.collection_days,
            createdEcopoint.collection_time,
            createdEcopoint.neighborhood_id,
            createdEcopoint.admin_id_created,
            createdEcopoint.admin_id_updated,
            createdEcopoint.created_at,
            createdEcopoint.updated_at
        );
    }

    async findById(id: number): Promise<Ecopoint | null> {
        const ecopoint = await this.prisma.ecopoint.findUnique({
            where: { id },
        });

        if (!ecopoint) return null;

        return new Ecopoint(
            ecopoint.id,
            ecopoint.name,
            ecopoint.address,
            ecopoint.accepted_materials,
            ecopoint.collection_days,
            ecopoint.collection_time,
            ecopoint.neighborhood_id,
            ecopoint.admin_id_created,
            ecopoint.admin_id_updated,
            ecopoint.created_at,
            ecopoint.updated_at
        );
    }

    async findAll(): Promise<Ecopoint[]> {
        const ecopoints = await this.prisma.ecopoint.findMany();

        return ecopoints.map(
            (ecopoint) =>
                new Ecopoint(
                    ecopoint.id,
                    ecopoint.name,
                    ecopoint.address,
                    ecopoint.accepted_materials,
                    ecopoint.collection_days,
                    ecopoint.collection_time,
                    ecopoint.neighborhood_id,
                    ecopoint.admin_id_created,
                    ecopoint.admin_id_updated,
                    ecopoint.created_at,
                    ecopoint.updated_at
                )
        );
    }

    async findByNeighborhoodId(neighborhoodId: number): Promise<Ecopoint[]> {
        const ecopoints = await this.prisma.ecopoint.findMany({
            where: { neighborhood_id: neighborhoodId },
        });

        return ecopoints.map(
            (ecopoint) =>
                new Ecopoint(
                    ecopoint.id,
                    ecopoint.name,
                    ecopoint.address,
                    ecopoint.accepted_materials,
                    ecopoint.collection_days,
                    ecopoint.collection_time,
                    ecopoint.neighborhood_id,
                    ecopoint.admin_id_created,
                    ecopoint.admin_id_updated,
                    ecopoint.created_at,
                    ecopoint.updated_at
                )
        );
    }

    async update(id: number, data: Partial<Omit<Ecopoint, "id" | "created_at">>): Promise<Ecopoint> {
        const updatedEcopoint = await this.prisma.ecopoint.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                accepted_materials: data.accepted_materials,
                collection_days: data.collection_days,
                collection_time: data.collection_time,
                neighborhood_id: data.neighborhood_id,
                admin_id_created: data.admin_id_created,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Ecopoint(
            updatedEcopoint.id,
            updatedEcopoint.name,
            updatedEcopoint.address,
            updatedEcopoint.accepted_materials,
            updatedEcopoint.collection_days,
            updatedEcopoint.collection_time,
            updatedEcopoint.neighborhood_id,
            updatedEcopoint.admin_id_created,
            updatedEcopoint.admin_id_updated,
            updatedEcopoint.created_at,
            updatedEcopoint.updated_at
        );
    }

    async delete(id: number): Promise<void> {
        await this.prisma.ecopoint.delete({
            where: { id },
        });
    }
}
