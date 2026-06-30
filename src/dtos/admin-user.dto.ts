import { z } from "zod";
import { RegisterSchema, UpdateProfileSchema } from "../types/auth.type";

// ── Create: pick the fields an admin supplies when creating a user ─────────────
export const CreateAdminUserDTO = RegisterSchema.pick({
  username: true,
  email: true,
  password: true,
  role: true,
});
export type CreateAdminUserDTO = z.infer<typeof CreateAdminUserDTO>;

// ── Update: reuse UpdateProfileSchema (already has role + status) fully partial ─
export const UpdateAdminUserDTO = UpdateProfileSchema.partial();
export type UpdateAdminUserDTO = z.infer<typeof UpdateAdminUserDTO>;
