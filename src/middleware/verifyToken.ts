import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../types/CustomRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as userRepositories from "../repositories/userRepositories";

export default async function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const [scheme, token] = authorization.split(" ");

    // Standar: Bearer <token>
    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid auth format" });
    }

    const secret = process.env.JWT_AUTH;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.id as string | undefined;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const user = await userRepositories.getUserById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
