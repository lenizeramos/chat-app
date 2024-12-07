import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isSessionActive } from "../middlware/session";
import { getPost, createPostHandler, likesCount, removePost } from "../controllers/postController";
import { upload } from "../middlware/upload";

export const prisma = new PrismaClient();

const router = Router();

router.get("/", isSessionActive, getPost);
router.post("/", isSessionActive, upload.single("photo"), createPostHandler);
router.put("/", isSessionActive, likesCount)
router.delete("/", isSessionActive, removePost)

export default router;
