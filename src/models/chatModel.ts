import { prisma } from "../prisma";

export const createChat = async (name: string) => {
  return await prisma.chat.create({ data: { name: name } });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id: id } });
};

export const addChatParticipant = async (chatId: number, userId: number) => {

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

  if (existingChat) {
    return true;
  }
  return false;
};

export const getChatByUserId = async (userId: any) => {
  let chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  chats = chats.map((chat) => {
    if (!chat.isGroup) {
      chat.name =
        chat.participants.find((participant) => userId != participant.userId)
          ?.user.username || "No name";
    }
    return chat;
  });

  return chats;
};
