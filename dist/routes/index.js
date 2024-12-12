"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const homeRoutes_1 = __importDefault(require("./homeRoutes"));
const errorRoutes_1 = __importDefault(require("./errorRoutes"));
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const groupChatRoutes_1 = __importDefault(require("./groupChatRoutes"));
exports.apiRouter = (0, express_1.Router)();
const ROUTER = [
    { url: "/auth", router: authRoutes_1.router },
    { url: "/", router: homeRoutes_1.default },
    { url: "/chat", router: chatRoutes_1.default },
    { url: "/chatroom", router: groupChatRoutes_1.default },
];
ROUTER.forEach(({ url, router }) => {
    exports.apiRouter.use(url, router);
});
exports.apiRouter.all("*", errorRoutes_1.default);
