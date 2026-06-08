import { z } from "zod";

export const RoleSchema = z.enum(["entrepreneur", "investor", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

//after login part for verifiaction and other's like profile pages etc
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  role: RoleSchema,
  // isVerified: z.boolean().optional(),
  // kycStatus: z.enum(["pending", "approved", "rejected"]).optional(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const RegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleSchema,
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;
