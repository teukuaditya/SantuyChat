import { sign } from 'crypto';
import {z} from 'zod';

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export const signInSchema = signUpSchema.pick({
    email: true,
    password: true,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;