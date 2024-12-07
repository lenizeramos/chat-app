import { Request, Response, RequestHandler, NextFunction } from "express";
import { createPost, getPostByUser, incrementLikes, removeUserPost } from "../models/postModel";

export const getPost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const posts = await getPostByUser(req.session.user?.id);
    res.render("pages/post", { user: req.session.user, posts, error: null });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const createPostHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const post = req.body;
    
  post.imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!post.content || !post.imageUrl) {
      return res.status(400).json({ error: "All fields are required." });
    }

    post.userId = req.session.user?.id;

    if (!post.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await createPost(post);

    res.redirect("/post");
  } catch (error) {
    res.json({ error: "Error creating post" });
  }
};

export const likesCount: RequestHandler = async (req: Request, res: Response) => {
  try {
    //const postId = parseInt(req.params.id);
    const { postId } = req.body;
    const updatedLikesCount = await incrementLikes(postId);
    res.json({ likesCount: updatedLikesCount });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const removePost = (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    //const postId = parseInt(req.params.id);
    if (!postId) {
      return res.status(400).send("Parameter 'postId' is required.");
    }
    removeUserPost(postId);
    res.status(200).send("Post removed successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : "Internal Server Error");
  }
};