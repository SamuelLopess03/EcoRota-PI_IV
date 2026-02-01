import { PrismaClient } from "@prisma/client";
import { Subscriber } from "../../../domain/entities/Subscriber.js";
import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { Address } from "../../../domain/value-objects/Address.js";
import { PostalCode } from "../../../domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../../domain/value-objects/GeoLocation.js";
import { EntityNotFoundError } from "../../../domain/errors/persistence/EntityNotFoundError.js";
import { ConflictError } from "../../../domain/errors/persistence/ConflictError.js";
import { PersistenceError } from "../../../domain/errors/persistence/PersistenceError.js";

export class PrismaSubscriberRepository implements SubscriberRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Omit<Subscriber, "id" | "createdAt" | "updatedAt">): Promise<Subscriber> {
        try {
            const createdSubscriber = await this.prisma.subscriber.create({
                data: {
                    email: data.email.getValue(),
                    street: data.address.getStreet(),
                    number: data.address.getNumber(),
                    complement: data.address.getComplement(),
                    postal_code: data.address.getPostalCode()?.getValue(),
                    latitude: data.address.getGeoLocation()?.getLatitude(),
                    longitude: data.address.getGeoLocation()?.getLongitude(),
                    neighborhood_id: data.neighborhoodId,
                },
            });

            return new Subscriber(
                createdSubscriber.id,
                new Email(createdSubscriber.email),
                new Address({
                    street: createdSubscriber.street,
                    number: createdSubscriber.number ?? undefined,
                    complement: createdSubscriber.complement ?? undefined,
                    postalCode: createdSubscriber.postal_code ? new PostalCode(createdSubscriber.postal_code) : undefined,
                    geoLocation: (createdSubscriber.latitude !== null && createdSubscriber.longitude !== null)
                        ? new GeoLocation(createdSubscriber.latitude, createdSubscriber.longitude)
                        : undefined,
                }),
                createdSubscriber.neighborhood_id,
                createdSubscriber.created_at,
                createdSubscriber.updated_at
            );
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictError(`Assinante com e-mail '${data.email.getValue()}' já existe.`);
            }
            throw new PersistenceError(`Erro ao criar assinante: ${error.message}`);
        }
    }

    async findById(id: number): Promise<Subscriber> {
        try {
            const subscriber = await this.prisma.subscriber.findUnique({
                where: { id },
            });

            if (!subscriber) {
                throw new EntityNotFoundError("Assinante", id);
            }

            return new Subscriber(
                subscriber.id,
                new Email(subscriber.email),
                new Address({
                    street: subscriber.street,
                    number: subscriber.number ?? undefined,
                    complement: subscriber.complement ?? undefined,
                    postalCode: subscriber.postal_code ? new PostalCode(subscriber.postal_code) : undefined,
                    geoLocation: (subscriber.latitude !== null && subscriber.longitude !== null)
                        ? new GeoLocation(subscriber.latitude, subscriber.longitude)
                        : undefined,
                }),
                subscriber.neighborhood_id,
                subscriber.created_at,
                subscriber.updated_at
            );
        } catch (error: any) {
            if (error instanceof EntityNotFoundError) throw error;
            throw new PersistenceError(`Erro ao buscar assinante por ID: ${error.message}`);
        }
    }

    async findByEmail(email: Email): Promise<Subscriber | null> {
        try {
            const subscriber = await this.prisma.subscriber.findUnique({
                where: { email: email.getValue() },
            });

            if (!subscriber) return null;

            return new Subscriber(
                subscriber.id,
                new Email(subscriber.email),
                new Address({
                    street: subscriber.street,
                    number: subscriber.number ?? undefined,
                    complement: subscriber.complement ?? undefined,
                    postalCode: subscriber.postal_code ? new PostalCode(subscriber.postal_code) : undefined,
                    geoLocation: (subscriber.latitude !== null && subscriber.longitude !== null)
                        ? new GeoLocation(subscriber.latitude, subscriber.longitude)
                        : undefined,
                }),
                subscriber.neighborhood_id,
                subscriber.created_at,
                subscriber.updated_at
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar assinante por e-mail: ${error.message}`);
        }
    }

    async findAll(): Promise<Subscriber[]> {
        try {
            const subscribers = await this.prisma.subscriber.findMany();

            return subscribers.map(
                (subscriber) =>
                    new Subscriber(
                        subscriber.id,
                        new Email(subscriber.email),
                        new Address({
                            street: subscriber.street,
                            number: subscriber.number ?? undefined,
                            complement: subscriber.complement ?? undefined,
                            postalCode: subscriber.postal_code ? new PostalCode(subscriber.postal_code) : undefined,
                            geoLocation: (subscriber.latitude !== null && subscriber.longitude !== null)
                                ? new GeoLocation(subscriber.latitude, subscriber.longitude)
                                : undefined,
                        }),
                        subscriber.neighborhood_id,
                        subscriber.created_at,
                        subscriber.updated_at
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar todos os assinantes: ${error.message}`);
        }
    }

    async findByNeighborhoodId(neighborhoodId: number): Promise<Subscriber[]> {
        try {
            const subscribers = await this.prisma.subscriber.findMany({
                where: { neighborhood_id: neighborhoodId },
            });

            return subscribers.map(
                (subscriber) =>
                    new Subscriber(
                        subscriber.id,
                        new Email(subscriber.email),
                        new Address({
                            street: subscriber.street,
                            number: subscriber.number ?? undefined,
                            complement: subscriber.complement ?? undefined,
                            postalCode: subscriber.postal_code ? new PostalCode(subscriber.postal_code) : undefined,
                            geoLocation: (subscriber.latitude !== null && subscriber.longitude !== null)
                                ? new GeoLocation(subscriber.latitude, subscriber.longitude)
                                : undefined,
                        }),
                        subscriber.neighborhood_id,
                        subscriber.created_at,
                        subscriber.updated_at
                    )
            );
        } catch (error: any) {
            throw new PersistenceError(`Erro ao buscar assinantes por bairro: ${error.message}`);
        }
    }

    async update(id: number, data: Partial<Omit<Subscriber, "id" | "createdAt">>): Promise<Subscriber> {
        try {
            const updatedSubscriber = await this.prisma.subscriber.update({
                where: { id },
                data: {
                    email: data.email?.getValue(),
                    street: data.address?.getStreet(),
                    number: data.address?.getNumber(),
                    complement: data.address?.getComplement(),
                    postal_code: data.address?.getPostalCode()?.getValue(),
                    latitude: data.address?.getGeoLocation()?.getLatitude(),
                    longitude: data.address?.getGeoLocation()?.getLongitude(),
                    neighborhood_id: data.neighborhoodId,
                },
            });

            return new Subscriber(
                updatedSubscriber.id,
                new Email(updatedSubscriber.email),
                new Address({
                    street: updatedSubscriber.street,
                    number: updatedSubscriber.number ?? undefined,
                    complement: updatedSubscriber.complement ?? undefined,
                    postalCode: updatedSubscriber.postal_code ? new PostalCode(updatedSubscriber.postal_code) : undefined,
                    geoLocation: (updatedSubscriber.latitude !== null && updatedSubscriber.longitude !== null)
                        ? new GeoLocation(updatedSubscriber.latitude, updatedSubscriber.longitude)
                        : undefined,
                }),
                updatedSubscriber.neighborhood_id,
                updatedSubscriber.created_at,
                updatedSubscriber.updated_at
            );
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Assinante", id);
            }
            if (error.code === 'P2002') {
                throw new ConflictError(`Já existe um assinante com este e-mail.`);
            }
            throw new PersistenceError(`Erro ao atualizar assinante: ${error.message}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.subscriber.delete({
                where: { id },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new EntityNotFoundError("Assinante", id);
            }
            throw new PersistenceError(`Erro ao deletar assinante: ${error.message}`);
        }
    }
}
