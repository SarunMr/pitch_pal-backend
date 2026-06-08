import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";

const authService = new AuthService();

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body: RegisterDTO = req.body;
      const user = await authService.register(body);
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
      const body: LoginDTO = req.body;
      const { user, token } = await authService.login(body);
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
