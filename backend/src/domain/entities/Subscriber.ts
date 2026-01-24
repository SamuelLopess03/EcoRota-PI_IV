import { Email } from "../value-objects/Email.js";
import { Address } from "../value-objects/Address.js";

export class Subscriber {
    constructor(
        public readonly id: number,
        public email: Email,
        public address: Address,
        public neighborhoodId: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}
