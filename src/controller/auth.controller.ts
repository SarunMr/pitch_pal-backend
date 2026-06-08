import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { HttpException } from "../exceptions/http-exception";
import z from "zod";

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
      res.status(201).json({
        message: "Registration successful",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
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
      res.status(200).json({
        message: "Login successful",
        data: {
          token,
          role: user.role,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
