import { prisma } from "../src/infrastructure/database/prismaClient.js";

async function withRetry<T>(operation: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === retries - 1) throw error;
      if (error.message?.includes('pool timeout')) {
        console.warn(`Prisma pool timeout detected. Retrying ${i + 1}/${retries} in ${delayMs}ms...`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Agreements limit reached");
}

export async function resetDatabase() {
  await withRetry(async () => {
    // Ordem importa por causa das FKs (relacionamentos)
    await prisma.reportedProblem.deleteMany();
    await prisma.ecopoint.deleteMany();
    await prisma.subscriber.deleteMany();
    await prisma.neighborhood.deleteMany();
    await prisma.route.deleteMany();
    await prisma.administrador.deleteMany();
  });
}
