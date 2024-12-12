"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionInactive = exports.extendSession = exports.isSessionActive = void 0;
const env_1 = require("../env");
const isSessionActive = (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/auth");
    }
};
exports.isSessionActive = isSessionActive;
const extendSession = (req, res, next) => {
    req.session.cookie.maxAge = Number(env_1.SESSION_MAX_AGE);
    next();
};
exports.extendSession = extendSession;
const isSessionInactive = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/");
    }
    else {
        next();
    }
};
exports.isSessionInactive = isSessionInactive;
