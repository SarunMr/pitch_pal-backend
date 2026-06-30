import { z } from "zod";

// ── Pagination meta returned with list responses ──────────────────────────────
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// ── Query params for GET /api/admin/users ─────────────────────────────────────
// All come from req.query as strings; coercion to numbers happens in the controller
export const AdminUserQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(["entrepreneur", "investor", "admin"]).optional(),
  status: z.enum(["active", "suspended", "banned"]).optional(),
});
export type AdminUserQuery = z.infer<typeof AdminUserQuerySchema>;
