import { prisma } from "../prisma";

export const createMessage = async (
  message: string,
  roomId: number,
  userId: number,
  fileUrl?: string
) => {
  if (!message && !fileUrl) {
    throw new Error("Message or fileUrl is required");
  }

  return await prisma.message.create({
    data: {
      content: message,
      chatId: roomId,
      userId: userId,
      imageUrl: fileUrl,
    },
  });
};

export const getMessageByChat = async (roomId: number) => {
  return await prisma.message.findMany({
    where: { chatId: roomId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
};
