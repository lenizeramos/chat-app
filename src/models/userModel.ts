import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
}

export const createUser = async (userData: CreateUserData) => {
  const userExists = await prisma.user.count({ where: { email: userData.email } });

  if (userExists === 1) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      avatar: userData.avatar || null
    }
  });
};

export const getAuthUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ 
    where: { email: email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      avatar: true
    }
  });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true
    }
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true
    }
  });
};
