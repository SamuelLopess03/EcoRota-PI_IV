import { PrismaClient } from "../../../../prisma/generated/client/client.js";
import { Subscriber } from "../../../domain/entities/Subscriber.js";
import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { Address } from "../../../domain/value-objects/Address.js";

export class PrismaSubscriberRepository implements SubscriberRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Omit<Subscriber, "id" | "created_at" | "updated_at">): Promise<Subscriber> {
        const createdSubscriber = await this.prisma.subscriber.create({
            data: {
                email: data.email.getValue(),
                street: data.address.getStreet(),
                number: data.address.getNumber(),
                complement: data.address.getComplement(),
                postal_code: data.address.getPostalCode(),
                latitude: data.address.getLatitude(),
                longitude: data.address.getLongitude(),
                neighborhood_id: data.neighborhood_id,
            },
        });

        return new Subscriber(
            createdSubscriber.id,
            new Email(createdSubscriber.email),
            new Address({
                street: createdSubscriber.street,
                number: createdSubscriber.number ?? undefined,
                complement: createdSubscriber.complement ?? undefined,
                postalCode: createdSubscriber.postal_code ?? undefined,
                latitude: createdSubscriber.latitude ?? undefined,
                longitude: createdSubscriber.longitude ?? undefined,
            }),
            createdSubscriber.neighborhood_id,
            createdSubscriber.created_at,
            createdSubscriber.updated_at
        );
    }

    async findById(id: number): Promise<Subscriber | null> {
        const subscriber = await this.prisma.subscriber.findUnique({
            where: { id },
        });

        if (!subscriber) return null;

        return new Subscriber(
            subscriber.id,
            new Email(subscriber.email),
            new Address({
                street: subscriber.street,
                number: subscriber.number ?? undefined,
                complement: subscriber.complement ?? undefined,
                postalCode: subscriber.postal_code ?? undefined,
                latitude: subscriber.latitude ?? undefined,
                longitude: subscriber.longitude ?? undefined,
            }),
            subscriber.neighborhood_id,
            subscriber.created_at,
            subscriber.updated_at
        );
    }

    async findByEmail(email: string): Promise<Subscriber | null> {
        const subscriber = await this.prisma.subscriber.findUnique({
            where: { email },
        });

        if (!subscriber) return null;

        return new Subscriber(
            subscriber.id,
            new Email(subscriber.email),
            new Address({
                street: subscriber.street,
                number: subscriber.number ?? undefined,
                complement: subscriber.complement ?? undefined,
                postalCode: subscriber.postal_code ?? undefined,
                latitude: subscriber.latitude ?? undefined,
                longitude: subscriber.longitude ?? undefined,
            }),
            subscriber.neighborhood_id,
            subscriber.created_at,
            subscriber.updated_at
        );
    }

    async findAll(): Promise<Subscriber[]> {
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
                        postalCode: subscriber.postal_code ?? undefined,
                        latitude: subscriber.latitude ?? undefined,
                        longitude: subscriber.longitude ?? undefined,
                    }),
                    subscriber.neighborhood_id,
                    subscriber.created_at,
                    subscriber.updated_at
                )
        );
    }

    async findByNeighborhoodId(neighborhoodId: number): Promise<Subscriber[]> {
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
                        postalCode: subscriber.postal_code ?? undefined,
                        latitude: subscriber.latitude ?? undefined,
                        longitude: subscriber.longitude ?? undefined,
                    }),
                    subscriber.neighborhood_id,
                    subscriber.created_at,
                    subscriber.updated_at
                )
        );
    }

    async update(id: number, data: Partial<Omit<Subscriber, "id" | "created_at">>): Promise<Subscriber> {
        const updatedSubscriber = await this.prisma.subscriber.update({
            where: { id },
            data: {
                email: data.email?.getValue(),
                street: data.address?.getStreet(),
                number: data.address?.getNumber(),
                complement: data.address?.getComplement(),
                postal_code: data.address?.getPostalCode(),
                latitude: data.address?.getLatitude(),
                longitude: data.address?.getLongitude(),
                neighborhood_id: data.neighborhood_id,
            },
        });

        return new Subscriber(
            updatedSubscriber.id,
            new Email(updatedSubscriber.email),
            new Address({
                street: updatedSubscriber.street,
                number: updatedSubscriber.number ?? undefined,
                complement: updatedSubscriber.complement ?? undefined,
                postalCode: updatedSubscriber.postal_code ?? undefined,
                latitude: updatedSubscriber.latitude ?? undefined,
                longitude: updatedSubscriber.longitude ?? undefined,
            }),
            updatedSubscriber.neighborhood_id,
            updatedSubscriber.created_at,
            updatedSubscriber.updated_at
        );
    }

    async delete(id: number): Promise<void> {
        await this.prisma.subscriber.delete({
            where: { id },
        });
    }
}
