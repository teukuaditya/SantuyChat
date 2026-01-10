import { Request, Response, NextFunction } from "express";
import { signUpSchema } from "../utils/schema/user";
import fs from "fs";
import * as userService from "../services/userService";

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
      // hapus file kalau validasi gagal
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

    const newUser = await userService.signUp(
      parse.data,
      req.file // pass the multer file object
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    // cleanup kalau error di tengah
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    next(error); // lempar ke error middleware
  }
};
