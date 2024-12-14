import { Response, Request, RequestHandler, NextFunction } from "express";
import {
  addChatParticipant,
  createChat,
  createGroupChat,
  doesDirectExist,
  getAllUsers,
  getUserById,
} from "../models/chatModel";

export const getUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not logged in." });
    }

    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createDirect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const directUserId = req.body.id;
  try {
    if (!req.session.user) {
      return res.status(400).json({ error: "User not logged in." });
    }

    if (!directUserId) {
      return res.status(400).json({ error: "Field is required." });
    }

    if (directUserId === req.session.user?.id) {
      return res
        .status(400)
        .json({ error: "Cannot create a chat with yourself." });
    }

    const directUser = await getUserById(directUserId);
    if (!directUser) {
      return res.status(500).json({ error: "Internal error." });
    }

    if (await doesDirectExist(directUserId, req.session.user?.id)) {
    } else {
      const chat = await createChat(directUser?.username);

      await addChatParticipant(chat.id, req.session.user?.id);
      await addChatParticipant(chat.id, directUserId);
    }

    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const createGroup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not logged in." });
    }

    const { name, users } = req.body;

    if (!name || !users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Invalid group data provided." });
    }

    const allParticipants = [...users, req.session.user.id];

    await createGroupChat(name, allParticipants);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Failed to create group chat" });
  }
};

export const uploadFile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
