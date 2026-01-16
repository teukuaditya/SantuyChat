import { SignUpValues, type ResetPasswordValues } from "../utils/schema/user";
import * as userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RoleType } from "@prisma/client";
import { SignInValues } from "../utils/schema/user";
import mailtrap from "../utils/mailtrap";

export const signUp = async (data: SignUpValues, file: Express.Multer.File) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);
  if (isEmailExist > 0) throw new Error("Email already taken");

  const user = await userRepositories.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 12),
    },
    file.filename,
    "USER" as RoleType
  );

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_AUTH ?? "",
    { expiresIn: "1 days" }
  );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
    token,
  };
};

export const signIn = async (data: SignInValues) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);
  if (isEmailExist === 0) {
    throw new Error("Invalid email or password");
  }

  const user = await userRepositories.findUserByEmail(data.email);

  const isPasswordValid = bcrypt.compareSync(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_AUTH ?? "",
    { expiresIn: "1 days" }
  );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
    token,
  };
};

export const getEmailReset = async (email: string) => {
  const data = await userRepositories.createPasswordReset(email);

  // kalau email tidak ditemukan, jangan bocorin
  if (!data) return true;

  try {
    await mailtrap.send({
      from: { email: "aditya@test.com", name: "aditya" },
      to: [{ email }],
      subject: "Password Reset",
      text: `Use this token to reset your password: ${data.token}`,
    });
  } catch (err) {
    // LOG untuk debugging
    console.error("Mailtrap send failed:", err);
    // lempar error yang jelas
    throw new Error("Failed to send reset email");
  }

  return true;
};

export const updatePassword = async (
  data: ResetPasswordValues,
  token: string
) => {
  const tokenData = await userRepositories.findResetDataByToken(token);
  if (!tokenData) throw new Error("Invalid or expired token");
  await userRepositories.updatePassword(
    tokenData.user.email,
    bcrypt.hashSync(data.password, 12)
  ),
    await userRepositories.deleteTokenResetById(tokenData.id);
  return true;
};
