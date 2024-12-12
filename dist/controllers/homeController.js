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
exports.searchUsers = exports.getIndex = void 0;
const chatModel_1 = require("../models/chatModel");
const prisma_1 = require("../prisma");
const getIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const chats = yield (0, chatModel_1.getChatByUserId)((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id);
        res.render("pages/home", { user: req.session.user, chats, error: null });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Couldn't load chats");
    }
});
exports.getIndex = getIndex;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const searchTerm = req.query.search;
        if (!searchTerm) {
            return res.json([]);
        }
        const users = yield prisma_1.prisma.user.findMany({
            where: {
                username: {
                    contains: searchTerm,
                    mode: 'insensitive'
                },
                NOT: {
                    id: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id
                }
            },
            select: {
                id: true,
                username: true
            },
            take: 5
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error searching users" });
    }
});
exports.searchUsers = searchUsers;
