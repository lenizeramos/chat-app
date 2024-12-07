import { app } from "./app";
import { HOST, PORT } from "./env";
import { createServer } from "http";
//import { Server } from "socket.io";
import { initSocket } from "./sockets/socket";

const server = createServer(app);

//const roomMessages: { [key: string]: { id: string; message: string }[] } = {};
//const userSockets: { [email: string]: string } = {}; // Map user to their sockets id

//const io = new Server(server);
const io = initSocket(server);

/* io.on("connection", (socket) => {
  const userEmail = socket.handshake.query.userEmail as string;
  console.log("===> in server.js : EMAIL = > ", userEmail);

  if (userEmail) {
    userSockets[userEmail] = socket.id;
    console.log(
      `User connected with email ${userEmail} has socket ID: ${socket.id}`
    );
  }

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    if (roomMessages[room]) {
      socket.emit("previousMessages", roomMessages[room]);
    }
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  socket.on("message", ({ room, message }) => {
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push({ id: userEmail, message });
    console.log("roomMessages:", roomMessages);

    io.to(room).emit("message", { id: userEmail, message });
  });

  socket.on("disconnect", () => {
    delete userSockets[userEmail];
    console.log(`${userEmail} disconnected with Socketid ${socket.id}`);
  });
}); */

server.listen(PORT, () => {
  console.log(`[server]: Listening at http://${HOST}:${PORT}`);
});
