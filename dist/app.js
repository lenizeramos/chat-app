"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./env");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, express_session_1.default)({
    secret: env_1.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: Number(env_1.SESSION_MAX_AGE) },
}));
exports.app.set("view engine", "ejs");
exports.app.set("views", path_1.default.join(__dirname, "views"));
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
exports.app.use(routes_1.apiRouter);
