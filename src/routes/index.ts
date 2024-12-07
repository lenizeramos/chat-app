import { Router } from "express";
import { router as authRoutes } from "./authRoutes";
import homeRoutes from "./homeRoutes";
import errorRoutes from "./errorRoutes";

export const apiRouter = Router();

const ROUTER = [
  { url: "/auth", router: authRoutes },
  { url: "/", router: homeRoutes },
];

ROUTER.forEach(({ url, router }) => {
  apiRouter.use(url, router);
});

apiRouter.all("*", errorRoutes);
