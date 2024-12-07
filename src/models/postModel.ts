import { prisma } from "../routes/postRoutes";
import { Post } from "@prisma/client";

export const createPost = async (post: Post) => {
  return await prisma.post.create({ data: post });
};

export const getPostByUser = async (id: number | undefined) => {
  return await prisma.post.findMany({
    where: { userId: id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
};

export const incrementLikes = async (id: number | undefined) => {
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });

  return updatedPost.likesCount;
};

export const removeUserPost = async (id: number | undefined) => {
  return await prisma.post.delete({
    where: { id },
  });
};
