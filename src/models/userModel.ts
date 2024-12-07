import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const createUser = async (user: User) => {
  const userExists = await prisma.user.count({ where: { email: user.email } });

  if (userExists === 1) {
    throw new Error("User already exists");
  }
  user.password = await bcrypt.hash(user.password, 10);
  return await prisma.user.create({ data: user });
};

export const getAuthUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email: email } });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};
