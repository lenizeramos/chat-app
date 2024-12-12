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
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const messageModel_1 = require("../models/messageModel");
const userModel_1 = require("../models/userModel");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        const username = socket.handshake.query.username;
        socket.on("joinRoom", (room) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(room);
            const messages = yield (0, messageModel_1.getMessageByChat)(room);
            if (messages) {
                socket.emit("previousMessages", messages.map((msg) => ({
                    username: msg.user.username,
                    content: msg.content,
                    imageUrl: msg.imageUrl,
                    createdAt: msg.createdAt,
                })));
            }
        }));
        socket.on("leaveRoom", (room) => {
            socket.leave(room);
        });
        socket.on("message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ room, message, fileUrl }) {
            const user = yield (0, userModel_1.getUserByUsername)(username);
            if (user) {
                yield (0, messageModel_1.createMessage)(message, room, user.id, fileUrl);
            }
            io.to(room).emit("message", { username, message, fileUrl });
        }));
        socket.on("disconnect", () => {
        });
    });
    return io;
};
exports.initSocket = initSocket;
