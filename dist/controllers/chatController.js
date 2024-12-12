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
exports.uploadFile = exports.createGroup = exports.createDirect = exports.getUsers = void 0;
const chatModel_1 = require("../models/chatModel");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not logged in." });
        }
        const users = yield (0, chatModel_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.getUsers = getUsers;
const createDirect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const directUserId = req.body.id;
    try {
        if (!req.session.user) {
            return res.status(400).json({ error: "User not logged in." });
        }
        if (!directUserId) {
            return res.status(400).json({ error: "Field is required." });
        }
        if (directUserId === ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res
                .status(400)
                .json({ error: "Cannot create a chat with yourself." });
        }
        const directUser = yield (0, chatModel_1.getUserById)(directUserId);
        if (!directUser) {
            return res.status(500).json({ error: "Internal error." });
        }
        if (yield (0, chatModel_1.doesDirectExist)(directUserId, (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id)) {
        }
        else {
            const chat = yield (0, chatModel_1.createChat)(directUser === null || directUser === void 0 ? void 0 : directUser.username);
            yield (0, chatModel_1.addChatParticipant)(chat.id, (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id);
            yield (0, chatModel_1.addChatParticipant)(chat.id, directUserId);
        }
        res.redirect("/");
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.createDirect = createDirect;
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not logged in." });
        }
        const { name, users } = req.body;
        if (!name || !users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ error: "Invalid group data provided." });
        }
        const allParticipants = [...users, req.session.user.id];
        yield (0, chatModel_1.createGroupChat)(name, allParticipants);
        res.redirect("/");
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create group chat" });
    }
});
exports.createGroup = createGroup;
const uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ message: "File uploaded successfully", fileUrl });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.uploadFile = uploadFile;
