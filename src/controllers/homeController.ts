import { Response, Request } from "express";
import { getChatByUserId } from "../models/chatModel";

export const getIndex = async (req: Request, res: Response) => {
  try {
    const chats = await getChatByUserId(req.session.user?.id);

    res.render("pages/home", { user: req.session.user, chats, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't load chats");
  }
};
