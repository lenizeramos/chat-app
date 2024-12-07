import { prisma } from "../routes/authRoutes";
//import { Chat } from "@prisma/client";

export const createChat = async (name: string) => {
  return await prisma.chat.create({ data: { name: name } });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id: id } });
};

export const addChatParticipant = async (chatId: number, userId: number) => {
  console.log(userId, "UserIdModel");

  return await prisma.chatParticipant.create({ data: { chatId, userId } });
};

export const doesDirectExist = async (user1Id: number, user2Id: number) => {
  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: {
          userId: { in: [user1Id, user2Id] },
        },
      },
    },
  });
  console.log(existingChat);

  if (existingChat) {
    return true;
  }
  return false;
};
