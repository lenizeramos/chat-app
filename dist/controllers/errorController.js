"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get404 = void 0;
const get404 = (req, res) => {
    res.render("pages/notFound");
};
exports.get404 = get404;
