import prisma from "../utils/prisma";
import type { RoleType } from "@prisma/client";
import type { SignUpValues } from "../utils/schema/user";
import crypto from "node:crypto";

export const isEmailExist = async (email: string) => {
  return prisma.user.count({ where: { email } });
};

export const findRole = async (role: RoleType) => {
  return prisma.role.findUnique({
    where: { role }, // role harus @unique di model Role
  });
};

export const createUser = async (
  data: SignUpValues,
  photo: string,
  roleType: RoleType = "USER"
) => {
  const role = await findRole(roleType);
  if (!role)
    throw new Error(`Role ${roleType} belum ada. Jalankan seed roles.`);

  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      photo,
      role_id: role.id,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
  });
};

export const createPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  const token = crypto.randomBytes(32).toString("hex");

  return await prisma.passwordReset.create({
    data: {
      user_id: user.id,
      token,
    },
  });
};

export const findResetDataByToken = async (token: string) => {
  return await prisma.passwordReset.findFirstOrThrow({
    where: {
      token: token,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
};

export const updatePassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: password,
    },
  });
};

export const deleteTokenResetById = async (id: string) => {
  return await prisma.passwordReset.delete({
    where: {
      id,
    },
  });
};
