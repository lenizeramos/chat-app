import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { prisma } from "../prisma";
import { createMessage } from "../models/messageModel";
import { getUserByUsername } from "../models/userModel";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server);
  const roomMessages: { [key: string]: { id: string; message: string }[] } = {};
  const userSockets: { [username: string]: string } = {}; // Map user to their sockets id

  io.on("connection", (socket) => {
    const username = socket.handshake.query.username as string;
    console.log("===> in server.js : username = > ", username);

    if (username) {
      userSockets[username] = socket.id;
      console.log(
        `User connected with username ${username} has socket ID: ${socket.id}`
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

    socket.on("message", async ({ room, message }) => {
      if (!roomMessages[room]) {
        roomMessages[room] = [];
      }
      const user = await getUserByUsername(username);
      if (user) {
        await createMessage(message, room, user.id);
        roomMessages[room].push({ id: username, message });
        console.log("roomMessages:", roomMessages);
      }

      io.to(room).emit("message", { id: username, message });
    });

    socket.on("disconnect", () => {
      delete userSockets[username];
      console.log(`${username} disconnected with Socketid ${socket.id}`);
    });
  });

  return io;
};
