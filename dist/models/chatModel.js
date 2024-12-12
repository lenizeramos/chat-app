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
exports.getChatByUserId = exports.doesDirectExist = exports.createGroupChat = exports.addChatParticipant = exports.getAllUsers = exports.getUserById = exports.createChat = void 0;
const prisma_1 = require("../prisma");
const createChat = (name_1, ...args_1) => __awaiter(void 0, [name_1, ...args_1], void 0, function* (name, isGroup = false) {
    return yield prisma_1.prisma.chat.create({ data: { name, isGroup } });
});
exports.createChat = createChat;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({ where: { id: id } });
});
exports.getUserById = getUserById;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany({
        select: {
            id: true,
            username: true,
            avatar: true
        }
    });
});
exports.getAllUsers = getAllUsers;
const addChatParticipant = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.chatParticipant.create({ data: { chatId, userId } });
});
exports.addChatParticipant = addChatParticipant;
const createGroupChat = (name, userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma_1.prisma.chat.create({
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
});
exports.createGroupChat = createGroupChat;
const doesDirectExist = (user1Id, user2Id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingChat = yield prisma_1.prisma.chat.findFirst({
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
});
exports.doesDirectExist = doesDirectExist;
const getChatByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let chats = yield prisma_1.prisma.chat.findMany({
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
        var _a;
        if (!chat.isGroup) {
            chat.name =
                ((_a = chat.participants.find((participant) => userId != participant.userId)) === null || _a === void 0 ? void 0 : _a.user.username) || "No name";
        }
        return chat;
    });
    return chats;
});
exports.getChatByUserId = getChatByUserId;
