import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createMessage, getMessageByChat } from "../models/messageModel";
import { getUserByUsername } from "../models/userModel";
import { getGroupParticipants } from "../models/groupChatModel";

let io: Server;

//const loggedUser = []

export const initSocket = (server: HttpServer) => {
  io = new Server(server);

  io.on("connection", async (socket) => {
    const username = socket.handshake.query.username as string;

    socket.join(username);
    //const user = await getUserByUsername(username);
    //loggedUser.push(user)

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

      (await getGroupParticipants(room))
        .filter((u) => u.user.id != user?.id)
        .forEach((u) => {
          io.to(u.user.username).emit("notification");
        });
    });

    socket.on("disconnect", () => {
      //console.log(`${username} disconnected with Socketid ${socket.id}`);
    });
  });

  return io;
};
