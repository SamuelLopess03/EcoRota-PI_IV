import { Email } from "../value-objects/Email.js";
import { Subscriber } from "../entities/Subscriber.js";

export interface SubscriberRepository {
    create(data: Omit<Subscriber, "id" | "createdAt" | "updatedAt">): Promise<Subscriber>;
    findById(id: number): Promise<Subscriber | null>;
    findByEmail(email: Email): Promise<Subscriber | null>;
    findAll(): Promise<Subscriber[]>;
    findByNeighborhoodId(neighborhoodId: number): Promise<Subscriber[]>;
    update(id: number, data: Partial<Omit<Subscriber, "id" | "createdAt">>): Promise<Subscriber>;
    delete(id: number): Promise<void>;
}
