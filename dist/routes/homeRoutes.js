"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const session_1 = require("../middlware/session");
const router = (0, express_1.Router)();
router.get("/", session_1.isSessionActive, session_1.extendSession, homeController_1.getIndex);
router.get("/search-users", session_1.isSessionActive, session_1.extendSession, homeController_1.searchUsers);
exports.default = router;
