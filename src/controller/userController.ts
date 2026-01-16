import { Request, Response, NextFunction } from "express";
import { signUpSchema, signInSchema } from "../utils/schema/user";
import fs from "fs";
import * as userService from "../services/userService";
import { z } from "zod";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const parse = signUpSchema.safeParse(req.body);

    if (!parse.success) {
      fs.unlinkSync(req.file.path);

      const errorMessages = parse.error.issues.map(
        (err) => `${err.path.join(".")} - ${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessages,
      });
    }

    const newUser = await userService.signUp(parse.data, req.file);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map(
        (err) => `${err.path.join(".")} - ${err.message}`
      );

      return res.status(500).json({
        success: false,
        message: "Email not registered",
      });
    }

    const data = await userService.signIn(parse.data);

    return res.status(200).json({
      success: true,
      message: "Sign in successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const resetEmailSchema = z.object({
  email: z.string().email(),
});

export const getEmailReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = resetEmailSchema.safeParse(req.body);

    if (!parse.success) {
      const detail = parse.error.issues.map(
        (err) => `${err.path.join(".")} - ${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail,
      });
    }

    await userService.getEmailReset(parse.data.email);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
};
