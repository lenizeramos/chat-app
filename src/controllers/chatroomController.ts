import { Request, Response, NextFunction } from "express";
import {
  createChatroom,
  getChatroomById,
  getAllChatrooms,
  addParticipantToChatroom,
  removeParticipantFromChatroom,
  addMessageToChatroom,
} from "../models/chatroomModel";

export const createNewChatroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Chatroom name is required" });
    }

    const chatroom = await createChatroom(name, req.session.user.id);
    res.status(201).json(chatroom);
  } catch (error) {
    next(error);
  }
};

export const getChatroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatroomId = parseInt(req.params.id);
    const chatroom = await getChatroomById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }

    res.status(200).json(chatroom);
  } catch (error) {
    next(error);
  }
};

export const listChatrooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatrooms = await getAllChatrooms();
    res.status(200).json(chatrooms);
  } catch (error) {
    next(error);
  }
};

export const joinChatroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatroomId = parseInt(req.params.id);
    const chatroom = await getChatroomById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }

    const participant = await addParticipantToChatroom(chatroomId, req.session.user.id);
    res.status(200).json(participant);
  } catch (error) {
    next(error);
  }
};

export const leaveChatroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatroomId = parseInt(req.params.id);
    const chatroom = await getChatroomById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }

    await removeParticipantFromChatroom(chatroomId, req.session.user.id);
    res.status(200).json({ message: "Successfully left the chatroom" });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatroomId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const chatroom = await getChatroomById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }

    const message = await addMessageToChatroom(chatroomId, req.session.user.id, content);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

