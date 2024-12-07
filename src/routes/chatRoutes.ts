import { Router } from "express";
import { getChat } from "../controllers/chatController";
import { isSessionActive, extendSession } from "../middlware/session";

const router = Router();

router.get("/", isSessionActive, extendSession, getChat);

export default router;
