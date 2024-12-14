import { Router } from "express";
import {
  createNewGroup,
  getGroup,
  listGroups,
  joinGroup,
  leaveGroup,
  sendMessage,
  getParticipants,
} from "../controllers/groupChatController";

const router = Router();

router.post("/", createNewGroup);

router.get("/", listGroups);

router.get("/:id", getGroup);

router.get("/:id/participants", getParticipants);

router.post("/:id/join", joinGroup);

router.post("/:id/leave", leaveGroup);

router.post("/:id/messages", sendMessage);

export default router;
