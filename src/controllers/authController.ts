import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcrypt";
import { getAuthUserByEmail, createUser } from "../models/userModel";

export const getAuth: RequestHandler = async (req: Request, res: Response) => {
  try {
    res.render("pages/auth", { error: null });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

declare module "express-session" {
  interface SessionData {
    user?: { username: string; email: string; id: number };
  }
}

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userBody = req.body;
  try {
    if (!userBody.username || !userBody.email || !userBody.password) {
      return res.status(400).json({ error: "All fields are required." });
    }

   const user = await createUser(userBody);

    req.session.user = { username: user.username, email: user.email, id: user.id };
    res.redirect("/");
  } catch (error) {
    res.json({ error: "User already exists!" });
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (req.session.user) {
    return res.redirect("/");
  }
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const user = await getAuthUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = { username: user.username, email: user.email, id: user.id };

      res.redirect("/");
    } else {
      res.json({ error: "Invalid email or password!" });
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser: RequestHandler = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/auth");
  });
};
