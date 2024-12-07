import { prisma } from "../prisma";

export const createMessage = async (message: string, roomId: number, userId: number) => {
    return await prisma.message.create({
        data: {
          content: message,
          chatId: roomId,
          userId: userId,
        },
      });
  };