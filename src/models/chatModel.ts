import { prisma } from "../prisma";

export const createChat = async (name: string, isGroup: boolean = false) => {
  return await prisma.chat.create({ data: { name, isGroup } });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id: id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      avatar: true
    }
  });
};

export const addChatParticipant = async (chatId: number, userId: number) => {
  return await prisma.chatParticipant.create({ data: { chatId, userId } });
};

export const createGroupChat = async (name: string, userIds: number[]) => {
  const chat = await prisma.chat.create({
    data: {
      name,
      isGroup: true,
      participants: {
        create: userIds.map(userId => ({
          userId
        }))
      }
    }
  });
  return chat;
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