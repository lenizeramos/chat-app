import { prisma } from "../routes/authRoutes";
//import { Chat } from "@prisma/client";

export const createChat = async () => {
 /*  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: {
          userId: { in: [user1Id, user2Id] },
        },
      },
    },
  });

  if (existingChat) {
    throw new Error("Chat already exists");
  } */

  return await prisma.chat.create({ data: {} });
};

/* export const getAuthUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email: email } });
}; */

export const addChatParticipant = async (chatId: number, userId: number) => {
  console.log(userId, "UserIdModel");
  
  return await prisma.chatParticipant.create({ data: { chatId, userId} });
}