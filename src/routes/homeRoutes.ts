import { Router } from "express";
import { getIndex } from "../controllers/homeController";
import { isSessionActive, extendSession } from "../middlware/session";

const router = Router();

router.get("/", isSessionActive, extendSession, getIndex);

export default router;
