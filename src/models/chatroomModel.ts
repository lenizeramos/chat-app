import { prisma } from "../prisma";

export const createChatroom = async (name: string, creatorId: number) => {
  const chatroom = await prisma.chat.create({
    data: {
      name,
      isGroup: true,
      participants: {
        create: {
          userId: creatorId,
        },
      },
    },
  });
  return chatroom;
};

export const getChatroomById = async (chatroomId: number) => {
  return await prisma.chat.findUnique({
    where: { id: chatroomId },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

export const getAllChatrooms = async () => {
  return await prisma.chat.findMany({
    where: { isGroup: true },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const addParticipantToChatroom = async (chatroomId: number, userId: number) => {
  return await prisma.chatParticipant.create({
    data: {
      chatId: chatroomId,
      userId: userId,
    },
  });
};

export const removeParticipantFromChatroom = async (chatroomId: number, userId: number) => {
  return await prisma.chatParticipant.delete({
    where: {
      userId_chatId: {
        userId: userId,
        chatId: chatroomId,
      },
    },
  });
};

export const addMessageToChatroom = async (chatroomId: number, userId: number, content: string) => {
  return await prisma.message.create({
    data: {
      content,
      userId,
      chatId: chatroomId,
    },
    include: {
      user: true,
    },
  });
};
