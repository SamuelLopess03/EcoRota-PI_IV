import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb(`${process.env.DATABASE_URL}`);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@ecorota.com";
  const existingAdmin = await prisma.administrador.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.administrador.create({
      data: {
        name: "Administrador Geral",
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log("Admin padrão criado com sucesso!");
    console.log("Email: admin@ecorota.com");
    console.log("Senha: admin123");
  } else {
    console.log("Admin padrão já existe.");
  }
}

main()
  .catch((e) => {
    console.error("Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
