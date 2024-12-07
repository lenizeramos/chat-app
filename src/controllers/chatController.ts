import { Response, Request, RequestHandler, NextFunction } from "express";
import { prisma } from "../routes/authRoutes";
import { addChatParticipant, createChat } from "../models/chatModel";

export const createDirect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chatBody = req.body;
  try {
    if (!chatBody.id) {
      return res.status(400).json({ error: "Field is required." });
    }
    if (!req.session.user) {
      return res.status(400).json({ error: "User not logged in." });
    }
    const chat = await createChat();

    await addChatParticipant(chat.id, req.session.user?.id);
    await addChatParticipant(chat.id, chatBody.id);

    res.redirect("/");
    //res.render("pages/home", { user: req.session.user });
  } catch (error) {
    res.json({ error: "Direct message already exist!" });
  }
};
