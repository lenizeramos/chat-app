"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_MAX_AGE = exports.SECRET = exports.HOST = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8080;
exports.HOST = process.env.HOST || 'localhost';
exports.SECRET = process.env.SECRET || "My secret value";
exports.SESSION_MAX_AGE = process.env.SESSION_MAX_AGE || 1000 * 60 * 60 * 24;
