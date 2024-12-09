import { Router } from "express";
import { isSessionActive, extendSession } from "../middlware/session";
import { createDirect, uploadFile } from "../controllers/chatController";
import { upload } from "../middlware/upload";

const router = Router();

router.post("/direct", isSessionActive, extendSession, createDirect);
router.post("/upload", isSessionActive, extendSession, upload.single("attach-file"), uploadFile);

export default router;
