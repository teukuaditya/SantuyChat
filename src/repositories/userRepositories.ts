import prisma from "../utils/prisma";
import type { RoleType } from "@prisma/client";
import type { SignUpValues } from "../utils/schema/user";

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
  if (!role) throw new Error(`Role ${roleType} belum ada. Jalankan seed roles.`);

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
