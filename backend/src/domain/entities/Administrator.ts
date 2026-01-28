import { Email } from "../value-objects/Email.js";

export class Administrator {
  constructor(
    public readonly id: number,
    public name: string,
    public email: Email,
    public password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }
}
