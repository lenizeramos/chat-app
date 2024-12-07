import { Router } from "express";
import { router as authRoutes } from "./authRoutes";
import homeRoutes from "./homeRoutes";
import errorRoutes from "./errorRoutes";
import chatRoutes from "./chatRoutes";

export const apiRouter = Router();

const ROUTER = [
  { url: "/auth", router: authRoutes },
  { url: "/", router: homeRoutes },
  { url: "/chat", router: chatRoutes },
];

ROUTER.forEach(({ url, router }) => {
  apiRouter.use(url, router);
});

apiRouter.all("*", errorRoutes);
