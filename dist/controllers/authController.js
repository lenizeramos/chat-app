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
exports.logoutUser = exports.loginUser = exports.registerUser = exports.getAuth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const userModel_1 = require("../models/userModel");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../public/uploads/avatars"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "avatar-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    },
}).single("avatar");
const getAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("pages/auth", { error: null });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.getAuth = getAuth;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                return res
                    .status(400)
                    .json({ error: "File upload error: " + err.message });
            }
            else if (err) {
                return res.status(400).json({ error: err.message });
            }
            try {
                const { username, email, password } = req.body;
                if (!username || !email || !password) {
                    return res.status(400).json({ error: "All fields are required." });
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ error: "Invalid email format." });
                }
                if (password.length < 6) {
                    return res
                        .status(400)
                        .json({ error: "Password must be at least 6 characters long." });
                }
                const avatarPath = req.file
                    ? `/uploads/avatars/${req.file.filename}`
                    : null;
                const userData = {
                    username,
                    email,
                    password,
                    avatar: avatarPath,
                };
                const user = yield (0, userModel_1.createUser)(userData);
                req.session.user = {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                };
                return res.status(200).json({
                    success: true,
                    message: "Registration successful",
                    redirect: "/",
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === "User already exists") {
                    return res
                        .status(400)
                        .json({ error: "User with this email already exists." });
                }
                return res
                    .status(500)
                    .json({ error: "An error occurred during registration." });
            }
        });
    });
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (req.session.user) {
        return res.status(200).json({ redirect: "/" });
    }
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required." });
        }
        const user = yield (0, userModel_1.getAuthUserByEmail)(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        req.session.user = {
            username: user.username,
            email: user.email,
            id: user.id,
        };
        return res.status(200).json({
            success: true,
            message: "Login successful",
            redirect: "/",
        });
    }
    catch (error) {
        return res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Error logging out" });
        }
        res.redirect("/auth");
    });
};
exports.logoutUser = logoutUser;
