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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByUsername = exports.getAuthUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield prisma_1.prisma.user.count({ where: { email: userData.email } });
    if (userExists === 1) {
        throw new Error("User already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
    return yield prisma_1.prisma.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            avatar: userData.avatar || null
        }
    });
});
exports.createUser = createUser;
const getAuthUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            username: true,
            email: true,
            password: true,
            avatar: true
        }
    });
});
exports.getAuthUserByEmail = getAuthUserByEmail;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true
        }
    });
});
exports.getUserByUsername = getUserByUsername;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true
        }
    });
});
exports.getUserById = getUserById;
