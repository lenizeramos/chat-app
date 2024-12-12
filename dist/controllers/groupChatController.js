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
exports.getParticipants = exports.sendMessage = exports.leaveGroup = exports.joinGroup = exports.listGroups = exports.getGroup = exports.createNewGroup = void 0;
const groupChatModel_1 = require("../models/groupChatModel");
const createNewGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Group name is required" });
        }
        const group = yield (0, groupChatModel_1.createGroupChat)(name, req.session.user.id);
        res.status(201).json(group);
    }
    catch (error) {
        next(error);
    }
});
exports.createNewGroup = createNewGroup;
const getGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groupId = parseInt(req.params.id);
        const group = yield (0, groupChatModel_1.getGroupChatById)(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    }
    catch (error) {
        next(error);
    }
});
exports.getGroup = getGroup;
const listGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groups = yield (0, groupChatModel_1.getAllGroupChats)();
        res.status(200).json(groups);
    }
    catch (error) {
        next(error);
    }
});
exports.listGroups = listGroups;
const joinGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groupId = parseInt(req.params.id);
        const group = yield (0, groupChatModel_1.getGroupChatById)(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        const participant = yield (0, groupChatModel_1.addGroupParticipant)(groupId, req.session.user.id);
        res.status(200).json(participant);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'User is already in this group') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
});
exports.joinGroup = joinGroup;
const leaveGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groupId = parseInt(req.params.id);
        const group = yield (0, groupChatModel_1.getGroupChatById)(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        yield (0, groupChatModel_1.removeGroupParticipant)(groupId, req.session.user.id);
        res.status(200).json({ message: "Successfully left the group" });
    }
    catch (error) {
        next(error);
    }
});
exports.leaveGroup = leaveGroup;
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groupId = parseInt(req.params.id);
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Message content is required" });
        }
        const message = yield (0, groupChatModel_1.addMessageToGroup)(groupId, req.session.user.id, content);
        res.status(201).json(message);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'User is not a member of this group') {
            return res.status(403).json({ error: error.message });
        }
        next(error);
    }
});
exports.sendMessage = sendMessage;
const getParticipants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const groupId = parseInt(req.params.id);
        const participants = yield (0, groupChatModel_1.getGroupParticipants)(groupId);
        res.status(200).json(participants);
    }
    catch (error) {
        next(error);
    }
});
exports.getParticipants = getParticipants;
