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
exports.getMessageByChat = exports.createMessage = void 0;
const prisma_1 = require("../prisma");
const createMessage = (message, roomId, userId, fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message && !fileUrl) {
        throw new Error("Message or fileUrl is required");
    }
    return yield prisma_1.prisma.message.create({
        data: {
            content: message,
            chatId: roomId,
            userId: userId,
            imageUrl: fileUrl,
        },
    });
});
exports.createMessage = createMessage;
const getMessageByChat = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.message.findMany({
        where: { chatId: roomId },
        include: { user: true },
        orderBy: { createdAt: "asc" },
    });
});
exports.getMessageByChat = getMessageByChat;
