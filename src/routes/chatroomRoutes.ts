import { Router } from "express";
import {
  createNewChatroom,
  getChatroom,
  listChatrooms,
  joinChatroom,
  leaveChatroom,
  sendMessage,
} from "../controllers/chatroomController";

const router = Router();

// Create a new chatroom
router.post("/", createNewChatroom);

// Get all chatrooms
router.get("/", listChatrooms);

// Get specific chatroom
router.get("/:id", getChatroom);

// Join a chatroom
router.post("/:id/join", joinChatroom);

// Leave a chatroom
router.post("/:id/leave", leaveChatroom);

// Send a message in a chatroom
router.post("/:id/messages", sendMessage);

export default router;
