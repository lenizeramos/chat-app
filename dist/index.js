"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./env");
const http_1 = require("http");
const socket_1 = require("./sockets/socket");
const server = (0, http_1.createServer)(app_1.app);
const io = (0, socket_1.initSocket)(server);
server.listen(env_1.PORT, () => {
    console.log(`[server]: Listening at http://${env_1.HOST}:${env_1.PORT}`);
});
