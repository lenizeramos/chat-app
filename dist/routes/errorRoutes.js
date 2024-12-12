"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorController_1 = require("../controllers/errorController");
const router = (0, express_1.Router)();
router.use(errorController_1.get404);
exports.default = router;
