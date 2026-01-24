import { Email } from "../value-objects/Email.js";
import { Administrator } from "../entities/Administrator.js";

export interface AdministratorRepository {
  create(admin: Omit<Administrator, "id" | "creationDate" | "updateDate">): Promise<Administrator>;
  findByEmail(email: Email): Promise<Administrator | null>;
  findById(id: number): Promise<Administrator | null>;
  findAll(): Promise<Administrator[]>;
  update(id: number, data: Partial<Omit<Administrator, "id" | "creationDate">>): Promise<Administrator>;
  delete(id: number): Promise<void>;
}
