import { z } from "zod";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "../types/auth.type";

export const RegisterDTO = RegisterSchema.pick({
  username: true,
  email: true,
  password: true,
  role: true,
});
export type RegisterDTO = z.infer<typeof RegisterDTO>;

export const LoginDTO = LoginSchema.pick({
  email: true,
  password: true,
});
export type LoginDTO = z.infer<typeof LoginDTO>;

export const UpdateUserDTO = UpdateProfileSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
