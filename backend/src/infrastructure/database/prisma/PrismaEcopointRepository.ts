import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Ecopoint } from "../../../domain/entities/Ecopoint.js";
import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";

export class PrismaEcopointRepository implements EcopointRepository {
    constructor(private prisma: PrismaClient) { }

    private parseCollectionTime(timeString: string): CollectionTime {
        const [startTime, endTime] = timeString.split(" - ");
        return new CollectionTime(startTime.trim(), endTime.trim());
    }

    async create(data: Omit<Ecopoint, "id" | "createdAt" | "updatedAt">): Promise<Ecopoint> {
        try {
            const createdEcopoint = await this.prisma.ecopoint.create({
                data: {
                    name: data.name,
                    partner_name: data.partnerName,
                    latitude: data.geoLocation.getLatitude(),
                    longitude: data.geoLocation.getLongitude(),
                    accepted_materials: data.acceptedMaterials.toString(),
                    collection_days: data.collectionDays.toString(),
                    collection_time: data.collectionTime.getFormattedInterval(),
                    neighborhood_id: data.neighborhoodId,
                    admin_id_created: data.adminIdCreated,
                    admin_id_updated: data.adminIdUpdated,
                },
            });

            return new Ecopoint(
                createdEcopoint.id,
                createdEcopoint.name,
                createdEcopoint.partner_name,
                AcceptedMaterials.fromString(createdEcopoint.accepted_materials),
                new GeoLocation(createdEcopoint.latitude, createdEcopoint.longitude),
                CollectionDays.fromString(createdEcopoint.collection_days),
                this.parseCollectionTime(createdEcopoint.collection_time),
                createdEcopoint.neighborhood_id,
                createdEcopoint.admin_id_created,
                createdEcopoint.admin_id_updated,
                createdEcopoint.created_at,
                createdEcopoint.updated_at
            );
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictError(`Ecoponto com dados conflitantes já existe.`);
            }
            throw new PersistenceError(`Erro ao criar ecoponto: ${error.message}`);
        }
    }

    async findById(id: number): Promise<Ecopoint> {
        try {
            const ecopoint = await this.prisma.ecopoint.findUnique({
                where: { id },
            });

            if (!ecopoint) {
                throw new EntityNotFoundError("Ecoponto", id);
            }

            return new Ecopoint(
                ecopoint.id,
                ecopoint.name,
                ecopoint.partner_name,
                AcceptedMaterials.fromString(ecopoint.accepted_materials),
                new GeoLocation(ecopoint.latitude, ecopoint.longitude),
                CollectionDays.fromString(ecopoint.collection_days),
                this.parseCollectionTime(ecopoint.collection_time),
                ecopoint.neighborhood_id,
                ecopoint.admin_id_created,
                ecopoint.admin_id_updated,
                ecopoint.created_at,
                ecopoint.updated_at
            );
        } catch (error: any) {
            if (error instanceof EntityNotFoundError) throw error;
            throw new PersistenceError(`Erro ao buscar ecoponto por ID: ${error.message}`);
        }
    }

    async findAll(): Promise<Ecopoint[]> {
        try {
            const ecopoints = await this.prisma.ecopoint.findMany();

            return ecopoints.map(
                (ecopoint) =>
                    new Ecopoint(
                        ecopoint.id,
                        ecopoint.name,
                        ecopoint.partner_name,
                        AcceptedMaterials.fromString(ecopoint.accepted_materials),
                        new GeoLocation(ecopoint.latitude, ecopoint.longitude),
                        CollectionDays.fromString(ecopoint.collection_days),
                        this.parseCollectionTime(ecopoint.collection_time),
                        ecopoint.neighborhood_id,
                        ecopoint.admin_id_created,
                        ecopoint.admin_id_updated,
                        ecopoint.created_at,
                        ecopoint.updated_at
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar todos os ecopontos: ${error.message}`);
        }
    }

    async findByNeighborhoodId(neighborhoodId: number): Promise<Ecopoint[]> {
        try {
            const ecopoints = await this.prisma.ecopoint.findMany({
                where: { neighborhood_id: neighborhoodId },
            });

            return ecopoints.map(
                (ecopoint) =>
                    new Ecopoint(
                        ecopoint.id,
                        ecopoint.name,
                        ecopoint.partner_name,
                        AcceptedMaterials.fromString(ecopoint.accepted_materials),
                        new GeoLocation(ecopoint.latitude, ecopoint.longitude),
                        CollectionDays.fromString(ecopoint.collection_days),
                        this.parseCollectionTime(ecopoint.collection_time),
                        ecopoint.neighborhood_id,
                        ecopoint.admin_id_created,
                        ecopoint.admin_id_updated,
                        ecopoint.created_at,
                        ecopoint.updated_at
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar ecopontos por bairro: ${error.message}`);
        }
    }

    async update(id: number, data: Partial<Omit<Ecopoint, "id" | "createdAt">>): Promise<Ecopoint> {
        try {
            const updatedEcopoint = await this.prisma.ecopoint.update({
                where: { id },
                data: {
                    name: data.name,
                    partner_name: data.partnerName,
                    latitude: data.geoLocation?.getLatitude(),
                    longitude: data.geoLocation?.getLongitude(),
                    accepted_materials: data.acceptedMaterials?.toString(),
                    collection_days: data.collectionDays?.toString(),
                    collection_time: data.collectionTime?.getFormattedInterval(),
                    neighborhood_id: data.neighborhoodId,
                    admin_id_created: data.adminIdCreated,
                    admin_id_updated: data.adminIdUpdated,
                },
            });

            return new Ecopoint(
                updatedEcopoint.id,
                updatedEcopoint.name,
                updatedEcopoint.partner_name,
                AcceptedMaterials.fromString(updatedEcopoint.accepted_materials),
                new GeoLocation(updatedEcopoint.latitude, updatedEcopoint.longitude),
                CollectionDays.fromString(updatedEcopoint.collection_days),
                this.parseCollectionTime(updatedEcopoint.collection_time),
                updatedEcopoint.neighborhood_id,
                updatedEcopoint.admin_id_created,
                updatedEcopoint.admin_id_updated,
                updatedEcopoint.created_at,
                updatedEcopoint.updated_at
            );
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Ecoponto", id);
            }
            if (error.code === 'P2002') {
                throw new ConflictError(`Já existe um ecoponto com estes dados.`);
            }
            throw new PersistenceError(`Erro ao atualizar ecoponto: ${error.message}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.ecopoint.delete({
                where: { id },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Ecoponto", id);
            }
            throw new PersistenceError(`Erro ao deletar ecoponto: ${error.message}`);
        }
    }
}
