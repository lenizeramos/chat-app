import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createMessage, getMessageByChat } from "../models/messageModel";
import { getUserByUsername } from "../models/userModel";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    const username = socket.handshake.query.username as string;
    console.log("===> in server.js : username = > ", username);

    socket.on("joinRoom", async (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
      const messages = await getMessageByChat(room);
      if (messages) {
        socket.emit(
          "previousMessages",
          messages.map((msg) => ({
            username: msg.user.username,
            content: msg.content,
            createdAt: msg.createdAt,
          }))
        );
      }
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`User ${socket.id} left room: ${room}`);
    });

    socket.on("message", async ({ room, message }) => {
      const user = await getUserByUsername(username);
      if (user) {
        await createMessage(message, room, user.id);
      }

      io.to(room).emit("message", { id: username, message });
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected with Socketid ${socket.id}`);
    });
  });

  return io;
};
