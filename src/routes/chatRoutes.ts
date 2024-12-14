import { Router } from "express";
import { isSessionActive, extendSession } from "../middlware/session";
import { createDirect, createGroup, getUsers, uploadFile } from "../controllers/chatController";
import { upload } from "../middlware/upload";

const router = Router();

router.get("/users", isSessionActive, extendSession, getUsers);
router.post("/direct", isSessionActive, extendSession, createDirect);
router.post("/group", isSessionActive, extendSession, createGroup);
router.post("/upload", isSessionActive, extendSession, upload.single("attach-file"), uploadFile);

export default router;