import { Response, Request, RequestHandler, NextFunction } from "express";
import {
  addChatParticipant,
  createChat,
  doesDirectExist,
  getUserById,
} from "../models/chatModel";

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
