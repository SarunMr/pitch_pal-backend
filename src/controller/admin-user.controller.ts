import { Request, Response, NextFunction } from "express";
import z from "zod";
import { AdminUserService } from "../services/admin-user.service";
import { CreateAdminUserDTO, UpdateAdminUserDTO } from "../dtos/admin-user.dto";
import { AdminUserQuerySchema } from "../types/admin-user.type";
import { ApiResponseHelper } from "../utils/api-response.util";
import { HttpException } from "../exceptions/http-exception";

const adminUserService = new AdminUserService();

export class AdminUserController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = AdminUserQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return next(new HttpException(400, z.prettifyError(parsed.error)));
      }

      const page = parseInt(parsed.data.page ?? "1", 10) || 1;
      const limit = parseInt(parsed.data.limit ?? "10", 10) || 10;
      const { search, role, status } = parsed.data;

      const { users, meta } = await adminUserService.getUsers(
        page,
        limit,
        search,
        role,
        status,
      );

      ApiResponseHelper.success(res, users, "Users retrieved successfully", 200, {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await adminUserService.getUserById(id);
      ApiResponseHelper.success(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = CreateAdminUserDTO.safeParse(req.body);
      if (!body.success) {
        return next(new HttpException(400, z.prettifyError(body.error)));
      }
      const user = await adminUserService.createUser(body.data);
      ApiResponseHelper.success(res, user, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = UpdateAdminUserDTO.safeParse(req.body);
      if (!body.success) {
        return next(new HttpException(400, z.prettifyError(body.error)));
      }
      const user = await adminUserService.updateUser(id, body.data);
      ApiResponseHelper.success(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const requesterId = req.user?._id.toString();
      if (!requesterId) return next(new HttpException(401, "Unauthorized"));
      await adminUserService.deleteUser(id, requesterId);
      ApiResponseHelper.success(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
