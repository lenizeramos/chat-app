import { prisma } from "../prisma";

export const createGroupChat = async (name: string, creatorId: number) => {
  return await prisma.chat.create({
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
};

export const getGroupChatById = async (chatId: number) => {
  return await prisma.chat.findFirst({
    where: {
      id: chatId,
      isGroup: true,
    },
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
          createdAt: "asc",
        },
      },
    },
  });
};

export const getAllGroupChats = async () => {
  return await prisma.chat.findMany({
    where: {
      isGroup: true,
    },
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
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const addGroupParticipant = async (chatId: number, userId: number) => {
  const existingParticipant = await prisma.chatParticipant.findUnique({
    where: {
      userId_chatId: {
        userId: userId,
        chatId: chatId,
      },
    },
  });

  if (existingParticipant) {
    throw new Error("User is already in this group");
  }

  return await prisma.chatParticipant.create({
    data: {
      chatId,
      userId,
    },
    include: {
      user: true,
    },
  });
};

export const removeGroupParticipant = async (
  chatId: number,
  userId: number
) => {
  return await prisma.chatParticipant.delete({
    where: {
      userId_chatId: {
        userId: userId,
        chatId: chatId,
      },
    },
  });
};

export const addMessageToGroup = async (
  chatId: number,
  userId: number,
  content: string
) => {
  const participant = await prisma.chatParticipant.findUnique({
    where: {
      userId_chatId: {
        userId: userId,
        chatId: chatId,
      },
    },
  });

  if (!participant) {
    throw new Error("User is not a member of this group");
  }

  return await prisma.message.create({
    data: {
      content,
      userId,
      chatId,
    },
    include: {
      user: true,
    },
  });
};

export const getGroupParticipants = async (chatId: number) => {
  return await prisma.chatParticipant.findMany({
    where: {
      chatId: chatId,
    },
    include: {
      user: true,
    },
  });
};
