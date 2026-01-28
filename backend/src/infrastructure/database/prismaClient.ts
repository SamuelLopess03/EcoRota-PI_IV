import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../../../prisma/generated/client/client.js";

const adapter = new PrismaMariaDb(`${process.env.DATABASE_URL}`)

export const prisma = new PrismaClient({ adapter });
