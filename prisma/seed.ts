import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      username: "User1",
      email: "user1@example.com",
      password: "password",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      username: "User2",
      email: "user2@example.com",
      password: "password",
    },
  });

  const chat = await prisma.chat.create({
    data: {
      name: "Chat Room 1",
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
