import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { getAuthUserByEmail, createUser } from "../models/userModel";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/avatars"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
}).single("avatar");

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
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { username, email, password } = req.body as {
        username: string;
        email: string;
        password: string;
      };

      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const emailRegex = /(^)(([A-Za-z0-9!#-&*--\/=?^_`{|}~][.]{0,1})+@[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z0-9]{2,})($)/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long." });
      }

      const avatarPath = req.file
        ? `/uploads/avatars/${req.file.filename}`
        : null;

      const userData = {
        username,
        email,
        password,
        avatar: avatarPath,
      };

      const user = await createUser(userData);

      req.session.user = {
        username: user.username,
        email: user.email,
        id: user.id,
      };

      return res.status(200).json({
        success: true,
        message: "Registration successful",
        redirect: "/",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists." });
      }
      return res
        .status(500)
        .json({ error: "An error occurred during registration." });
    }
  });
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as { email: string; password: string };

  if (req.session.user) {
    return res.status(200).json({ redirect: "/" });
  }

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await getAuthUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    req.session.user = {
      username: user.username,
      email: user.email,
      id: user.id,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      redirect: "/",
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login." });
  }
};

export const logoutUser: RequestHandler = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    res.redirect("/auth");
  });
};
