import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const client = await db.client.upsert({
    where: { slug: "tik-deia" },
    update: {},
    create: { name: "Tik Dèia", slug: "tik-deia" },
  });

  const agencyPassword = await bcrypt.hash("agencia123", 10);
  await db.user.upsert({
    where: { email: "agencia@suaagencia.com" },
    update: {},
    create: {
      email: "agencia@suaagencia.com",
      passwordHash: agencyPassword,
      role: "AGENCY",
    },
  });

  const clientPassword = await bcrypt.hash("tikdeia123", 10);
  await db.user.upsert({
    where: { email: "tikdeia@cliente.com" },
    update: {},
    create: {
      email: "tikdeia@cliente.com",
      passwordHash: clientPassword,
      role: "CLIENT",
      clientId: client.id,
    },
  });

  const existingPosts = await db.post.count({ where: { clientId: client.id } });
  if (existingPosts === 0) {
    await db.post.createMany({
      data: [
        {
          clientId: client.id,
          mediaUrl: "/uploads/tik-deia/pizza-margherita.svg",
          mediaType: "IMAGE",
          caption:
            "Pizza Margherita fresquinha saindo do forno a lenha 🍕🔥 Quem já babou?",
          scheduledDate: new Date("2026-07-22T18:00:00"),
          status: "PENDING",
        },
        {
          clientId: client.id,
          mediaUrl: "/uploads/tik-deia/promo-sexta.svg",
          mediaType: "IMAGE",
          caption:
            "Sexta é dia de pizza em dobro! Chama a galera e vem comer com a gente 🎉",
          scheduledDate: new Date("2026-07-24T12:00:00"),
          status: "APPROVED",
        },
        {
          clientId: client.id,
          mediaUrl: "/uploads/tik-deia/ingredientes-frescos.svg",
          mediaType: "IMAGE",
          caption:
            "Direto da horta pra sua pizza: tomate, manjericão e muito carinho 🌿",
          scheduledDate: new Date("2026-07-28T17:00:00"),
          status: "CHANGES_REQUESTED",
        },
      ],
    });

    const changesPost = await db.post.findFirst({
      where: { clientId: client.id, status: "CHANGES_REQUESTED" },
    });
    const clientUser = await db.user.findUniqueOrThrow({
      where: { email: "tikdeia@cliente.com" },
    });

    if (changesPost) {
      await db.comment.create({
        data: {
          postId: changesPost.id,
          authorId: clientUser.id,
          authorRole: "CLIENT",
          text: "Adorei a ideia! Só troca a legenda pra mencionar que é sem conservantes.",
        },
      });
    }
  }

  console.log("Seed concluído.");
  console.log("Login agência:  agencia@suaagencia.com / agencia123");
  console.log("Login cliente:  tikdeia@cliente.com / tikdeia123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
