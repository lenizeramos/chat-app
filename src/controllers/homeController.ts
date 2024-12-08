import { Response, Request } from "express";
import { prisma } from "../prisma";

export const getIndex = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chatParticipant.findMany({
      where: {userId: req.session.user?.id},
      include: { chat: true },
    });
    
    res.render("pages/home", { user: req.session.user, chats, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't load chats");
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.search as string;
    
    if (!searchTerm) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm,
          mode: 'insensitive'
        },
        NOT: {
          id: req.session.user?.id // Exclude current user
        }
      },
      select: {
        id: true,
        username: true
      },
      take: 5 // Limit results
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error searching users" });
  }
};
