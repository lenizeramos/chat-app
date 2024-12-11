import { Router } from "express";
import {
  createNewGroup,
  getGroup,
  listGroups,
  joinGroup,
  leaveGroup,
  sendMessage,
  getParticipants
} from "../controllers/chatroomController";

const router = Router();

// Create a new group
router.post("/", createNewGroup);

// Get all groups
router.get("/", listGroups);

// Get specific group
router.get("/:id", getGroup);

// Get group participants
router.get("/:id/participants", getParticipants);

// Join a group
router.post("/:id/join", joinGroup);

// Leave a group
router.post("/:id/leave", leaveGroup);

// Send a message in a group
router.post("/:id/messages", sendMessage);

export default router;
