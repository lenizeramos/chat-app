import { app } from "./app";
import { HOST, PORT } from "./env";
import { createServer } from "http";
import { initSocket } from "./sockets/socket";

const server = createServer(app);

const io = initSocket(server);

server.listen(PORT, () => {
  console.log(`[server]: Listening at http://${HOST}:${PORT}`);
});
