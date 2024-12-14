import { Router } from "express";
import { getIndex, searchUsers } from "../controllers/homeController";
import { isSessionActive, extendSession } from "../middlware/session";

const router = Router();

router.get("/", isSessionActive, extendSession, getIndex);
router.get("/search-users", isSessionActive, extendSession, searchUsers);

export default router;
