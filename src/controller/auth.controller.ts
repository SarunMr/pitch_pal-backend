import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDTO, RegisterDTO, UpdateUserDTO } from "../dtos/auth.dto";
import z from "zod";
import { ApiResponseHelper } from "../utils/api-response.util";
import { HttpException } from "../exceptions/http-exception";

const authService = new AuthService();

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = RegisterDTO.safeParse(req.body);
      if (!body.success) {
        return next(new HttpException(400, z.prettifyError(body.error)));
      }
      const user = await authService.register(body.data);
      ApiResponseHelper.success(res, user, "Registration successful", 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = LoginDTO.safeParse(req.body);
      if (!body.success) {
        return next(new HttpException(400, z.prettifyError(body.error)));
      }
      const { user, token } = await authService.login(body.data);
      ApiResponseHelper.success(res, { user, token }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.user?._id.toString();
      if (!id) return next(new HttpException(401, "Unauthorized"));

      const filename = req.file?.filename;

      const body = UpdateUserDTO.safeParse(req.body);
      if (!body.success) {
        return next(new HttpException(400, z.prettifyError(body.error)));
      }

      const updateData = {
        ...body.data,
        ...(filename && { profilePicture: "/uploads/" + filename }),
      };

      const user = await authService.updateUser(id, updateData);
      ApiResponseHelper.success(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async whoami(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) return next(new HttpException(401, "Unauthorized"));
      ApiResponseHelper.success(res, user, "User info retrieved");
    } catch (error) {
      next(error);
    }
  }
}
