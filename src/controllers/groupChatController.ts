import { Request, Response, NextFunction } from "express";
import {
  createGroupChat,
  getGroupChatById,
  getAllGroupChats,
  addGroupParticipant,
  removeGroupParticipant,
  addMessageToGroup,
  getGroupParticipants
} from "../models/groupChatModel";

export const createNewGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const group = await createGroupChat(name, req.session.user.id);
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groupId = parseInt(req.params.id);
    const group = await getGroupChatById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

export const listGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groups = await getAllGroupChats();
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groupId = parseInt(req.params.id);
    const group = await getGroupChatById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const participant = await addGroupParticipant(groupId, req.session.user.id);
    res.status(200).json(participant);
  } catch (error) {
    if (error instanceof Error && error.message === 'User is already in this group') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groupId = parseInt(req.params.id);
    const group = await getGroupChatById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    await removeGroupParticipant(groupId, req.session.user.id);
    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groupId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const group = await getGroupChatById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const message = await addMessageToGroup(groupId, req.session.user.id, content);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof Error && error.message === 'User is not a member of this group') {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};

export const getParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const groupId = parseInt(req.params.id);
    const participants = await getGroupParticipants(groupId);
    res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
};
