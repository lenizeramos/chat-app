import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createMessage, getMessageByChat } from "../models/messageModel";
import { getUserByUsername } from "../models/userModel";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    const username = socket.handshake.query.username as string;

    socket.on("joinRoom", async (room) => {
      socket.join(room);

      const messages = await getMessageByChat(room);
      if (messages) {
        socket.emit(
          "previousMessages",
          messages.map((msg) => ({
            username: msg.user.username,
            content: msg.content,
            imageUrl: msg.imageUrl,
            createdAt: msg.createdAt,
          }))
        );
      }
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
    });

    socket.on("message", async ({ room, message, fileUrl }) => {
      const user = await getUserByUsername(username);
      if (user) {
        await createMessage(message, room, user.id, fileUrl);
      }

      io.to(room).emit("message", { username, message, fileUrl });
    });

    socket.on("disconnect", () => {
      //console.log(`${username} disconnected with Socketid ${socket.id}`);
    });
  });

  return io;
};
