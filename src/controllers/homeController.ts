import { Response, Request } from "express";
import { prisma } from "../routes/authRoutes";

export const getIndex = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chatParticipant.findMany({
      where: {userId: req.session.user?.id},
      include: { user: true, chat: true },
      orderBy: { joinedAt: "desc" },
    });
    //console.log(chats);
    
    res.render("pages/home", { user: req.session.user, chats, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't get home");
  }
};
