import express from "express";
import multer from "multer";
import { storageUserPhoto } from "../utils/multer";
import * as userController from "../controller/userController";

const userRoutes = express.Router();

const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }
    return callback(null, false);
  },
});

userRoutes.post(
  "/auth/sign-up",
  uploadPhoto.single("photo"),
  userController.signUp
);

userRoutes.post("/auth/sign-in", userController.signIn);

userRoutes.post("/auth/reset-password", userController.getEmailReset);

export default userRoutes;
