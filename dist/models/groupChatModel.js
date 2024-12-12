"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupParticipants = exports.addMessageToGroup = exports.removeGroupParticipant = exports.addGroupParticipant = exports.getAllGroupChats = exports.getGroupChatById = exports.createGroupChat = void 0;
const prisma_1 = require("../prisma");
const createGroupChat = (name, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chat.create({
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
});
exports.createGroupChat = createGroupChat;
const getGroupChatById = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chat.findFirst({
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
                    createdAt: 'asc',
                },
            },
        },
    });
});
exports.getGroupChatById = getGroupChatById;
const getAllGroupChats = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chat.findMany({
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
                    createdAt: 'desc',
                },
            },
        },
    });
});
exports.getAllGroupChats = getAllGroupChats;
const addGroupParticipant = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingParticipant = yield prisma_1.prisma.chatParticipant.findUnique({
        where: {
            userId_chatId: {
                userId: userId,
                chatId: chatId,
            },
        },
    });
    if (existingParticipant) {
        throw new Error('User is already in this group');
    }
    return yield prisma_1.prisma.chatParticipant.create({
        data: {
            chatId,
            userId,
        },
        include: {
            user: true,
        },
    });
});
exports.addGroupParticipant = addGroupParticipant;
const removeGroupParticipant = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chatParticipant.delete({
        where: {
            userId_chatId: {
                userId: userId,
                chatId: chatId,
            },
        },
    });
});
exports.removeGroupParticipant = removeGroupParticipant;
const addMessageToGroup = (chatId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const participant = yield prisma_1.prisma.chatParticipant.findUnique({
        where: {
            userId_chatId: {
                userId: userId,
                chatId: chatId,
            },
        },
    });
    if (!participant) {
        throw new Error('User is not a member of this group');
    }
    return yield prisma_1.prisma.message.create({
        data: {
            content,
            userId,
            chatId,
        },
        include: {
            user: true,
        },
    });
});
exports.addMessageToGroup = addMessageToGroup;
const getGroupParticipants = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chatParticipant.findMany({
        where: {
            chatId: chatId,
        },
        include: {
            user: true,
        },
    });
});
exports.getGroupParticipants = getGroupParticipants;
