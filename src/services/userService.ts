import { SignUpValues } from "../utils/schema/user";
import * as userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RoleType } from "@prisma/client";


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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_AUTH ?? "", { expiresIn: '1 days' });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        token,
    }
}

