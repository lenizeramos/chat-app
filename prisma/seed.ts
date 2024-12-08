import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      username: "Adm",
      email: "admin@admin.com",
      password: await bcrypt.hash("admiN*&", 10),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "leni@leni.com" },
    update: {},
    create: {
      username: "Leni",
      email: "leni@leni.com",
      password: await bcrypt.hash("leni*&", 10),
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "joan@joan.com" },
    update: {},
    create: {
      username: "Joan",
      email: "joan@joan.com",
      password: await bcrypt.hash("joan*&", 10),
    },
  });
  const user4 = await prisma.user.upsert({
    where: { email: "julio@julio.com" },
    update: {},
    create: {
      username: "Julio",
      email: "julio@julio.com",
      password: await bcrypt.hash("julio*&", 10),
    },
  });
  const user5 = await prisma.user.upsert({
    where: { email: "awshaf@awshaf.com" },
    update: {},
    create: {
      username: "Awshaf",
      email: "awshaf@awshaf.com",
      password: await bcrypt.hash("awshaf*&", 10),
    },
  });

  const chat = await prisma.chat.create({
    data: {
      name: "Chat Room",
      isGroup: false,
    },
  });

  await prisma.chatParticipant.createMany({
    data: [
      { userId: user1.id, chatId: chat.id },
      { userId: user2.id, chatId: chat.id },
    ],
  });

  await prisma.message.create({
    data: {
      content: "Hello!",
      chatId: chat.id,
      userId: user1.id,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
