import { Router } from "express";
import {
  getAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";
import { isSessionInactive } from "../middlware/session";


export const router = Router();

router.get("/", isSessionInactive, getAuth);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
