import { Router } from "express";
import { isSessionActive, extendSession } from "../middlware/session";
import { createDirect } from "../controllers/chatController";

const router = Router();

router.post("/direct", isSessionActive, extendSession, createDirect);

export default router;
