import { Request, Response, NextFunction } from "express";
import { SESSION_MAX_AGE } from "../env";

export const isSessionActive = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth");
  }
};

export const extendSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.cookie.maxAge = Number(SESSION_MAX_AGE);
  next();
};

export const isSessionInactive = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};
