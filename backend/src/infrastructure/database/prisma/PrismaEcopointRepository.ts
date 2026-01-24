import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Ecopoint } from "../../../domain/entities/Ecopoint.js";
import { EcopointRepository } from "../../../domain/repositories/EcopointRepository.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";
import { AcceptedMaterials } from "../../../domain/value-objects/AcceptedMaterials.js";
import { Address } from "../../../domain/value-objects/Address.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";

export class PrismaEcopointRepository implements EcopointRepository {
    constructor(private prisma: PrismaClient) { }

    private parseCollectionTime(timeString: string): CollectionTime {
        const [startTime, endTime] = timeString.split(" - ");
        return new CollectionTime(startTime.trim(), endTime.trim());
    }

    async create(data: Omit<Ecopoint, "id" | "created_at" | "updated_at">): Promise<Ecopoint> {
        const createdEcopoint = await this.prisma.ecopoint.create({
            data: {
                name: data.name,
                street: data.address.getStreet(),
                number: data.address.getNumber(),
                complement: data.address.getComplement(),
                postal_code: data.address.getPostalCode()?.getValue(),
                latitude: data.address.getGeoLocation()?.getLatitude(),
                longitude: data.address.getGeoLocation()?.getLongitude(),
                accepted_materials: data.accepted_materials.toString(),
                collection_days: data.collection_days.toString(),
                collection_time: data.collection_time.getFormattedInterval(),
                neighborhood_id: data.neighborhood_id,
                admin_id_created: data.admin_id_created,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Ecopoint(
            createdEcopoint.id,
            createdEcopoint.name,
            AcceptedMaterials.fromString(createdEcopoint.accepted_materials),
            new Address({
                street: createdEcopoint.street,
                number: createdEcopoint.number ?? undefined,
                complement: createdEcopoint.complement ?? undefined,
                postalCode: createdEcopoint.postal_code ? new PostalCode(createdEcopoint.postal_code) : undefined,
                geoLocation: (createdEcopoint.latitude !== null && createdEcopoint.longitude !== null)
                    ? new GeoLocation(createdEcopoint.latitude, createdEcopoint.longitude)
                    : undefined,
            }),
            CollectionDays.fromString(createdEcopoint.collection_days),
            this.parseCollectionTime(createdEcopoint.collection_time),
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
            AcceptedMaterials.fromString(ecopoint.accepted_materials),
            new Address({
                street: ecopoint.street,
                number: ecopoint.number ?? undefined,
                complement: ecopoint.complement ?? undefined,
                postalCode: ecopoint.postal_code ? new PostalCode(ecopoint.postal_code) : undefined,
                geoLocation: (ecopoint.latitude !== null && ecopoint.longitude !== null)
                    ? new GeoLocation(ecopoint.latitude, ecopoint.longitude)
                    : undefined,
            }),
            CollectionDays.fromString(ecopoint.collection_days),
            this.parseCollectionTime(ecopoint.collection_time),
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
                    AcceptedMaterials.fromString(ecopoint.accepted_materials),
                    new Address({
                        street: ecopoint.street,
                        number: ecopoint.number ?? undefined,
                        complement: ecopoint.complement ?? undefined,
                        postalCode: ecopoint.postal_code ? new PostalCode(ecopoint.postal_code) : undefined,
                        geoLocation: (ecopoint.latitude !== null && ecopoint.longitude !== null)
                            ? new GeoLocation(ecopoint.latitude, ecopoint.longitude)
                            : undefined,
                    }),
                    CollectionDays.fromString(ecopoint.collection_days),
                    this.parseCollectionTime(ecopoint.collection_time),
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
                    AcceptedMaterials.fromString(ecopoint.accepted_materials),
                    new Address({
                        street: ecopoint.street,
                        number: ecopoint.number ?? undefined,
                        complement: ecopoint.complement ?? undefined,
                        postalCode: ecopoint.postal_code ? new PostalCode(ecopoint.postal_code) : undefined,
                        geoLocation: (ecopoint.latitude !== null && ecopoint.longitude !== null)
                            ? new GeoLocation(ecopoint.latitude, ecopoint.longitude)
                            : undefined,
                    }),
                    CollectionDays.fromString(ecopoint.collection_days),
                    this.parseCollectionTime(ecopoint.collection_time),
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
                street: data.address?.getStreet(),
                number: data.address?.getNumber(),
                complement: data.address?.getComplement(),
                postal_code: data.address?.getPostalCode()?.getValue(),
                latitude: data.address?.getGeoLocation()?.getLatitude(),
                longitude: data.address?.getGeoLocation()?.getLongitude(),
                accepted_materials: data.accepted_materials?.toString(),
                collection_days: data.collection_days?.toString(),
                collection_time: data.collection_time?.getFormattedInterval(),
                neighborhood_id: data.neighborhood_id,
                admin_id_created: data.admin_id_created,
                admin_id_updated: data.admin_id_updated,
            },
        });

        return new Ecopoint(
            updatedEcopoint.id,
            updatedEcopoint.name,
            AcceptedMaterials.fromString(updatedEcopoint.accepted_materials),
            new Address({
                street: updatedEcopoint.street,
                number: updatedEcopoint.number ?? undefined,
                complement: updatedEcopoint.complement ?? undefined,
                postalCode: updatedEcopoint.postal_code ? new PostalCode(updatedEcopoint.postal_code) : undefined,
                geoLocation: (updatedEcopoint.latitude !== null && updatedEcopoint.longitude !== null)
                    ? new GeoLocation(updatedEcopoint.latitude, updatedEcopoint.longitude)
                    : undefined,
            }),
            CollectionDays.fromString(updatedEcopoint.collection_days),
            this.parseCollectionTime(updatedEcopoint.collection_time),
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
