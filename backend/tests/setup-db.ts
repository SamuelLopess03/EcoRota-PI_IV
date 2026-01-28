import { prisma } from "../src/infrastructure/database/prismaClient.js";

export async function resetDatabase() {
  // Ordem importa por causa das FKs (relacionamentos)
  await prisma.reportedProblem.deleteMany();
  await prisma.ecopoint.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.neighborhood.deleteMany();
  await prisma.route.deleteMany();
  await prisma.administrador.deleteMany();
}
