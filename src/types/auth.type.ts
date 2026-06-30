import { z } from "zod";

export const RoleSchema = z.enum(["entrepreneur", "investor", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

export const StatusSchema = z.enum(["active", "suspended", "banned"]);
export type Status = z.infer<typeof StatusSchema>;

//after login part for verifiaction and other's like profile pages etc
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  role: RoleSchema,
  status: StatusSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicture: z.string().optional(), // local file path URL
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
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

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  profilePicture: z.string().optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  role: RoleSchema.optional(),
  status: StatusSchema.optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ResetPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
