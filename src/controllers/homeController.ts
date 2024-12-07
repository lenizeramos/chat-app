import { Response, Request } from "express";
import { prisma } from "../routes/authRoutes";

export const getIndex = async (req: Request, res: Response) => {
  /* try {
    const posts = await prisma.post.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.render("pages/home", { user: req.session.user, posts, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't get feed");
  } */

    res.render("pages/home", { user: req.session.user });
};
