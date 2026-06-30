import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/auth.model";
import { UserMongoRepository } from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/api-response.util";
import { SECRET_KEY } from "../config/constant";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const userRepository = new UserMongoRepository();

export const authorizeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpException(401, "Unauthorized: missing token");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new HttpException(401, "Unauthorized: invalid token");
    }
    const decoded = jwt.verify(token, SECRET_KEY as string) as Record<
      string,
      any
    >;
    if (!decoded || !decoded.id) {
      throw new HttpException(401, "Unauthorized: unverified token");
    }
    const user = await userRepository.getUserById(decoded.id);
    if (!user) {
      throw new HttpException(401, "Unauthorized: user not found");
    }
    req.user = user;
    next();
  } catch (err: any) {
    ApiResponseHelper.error(
      res,
      err.message || "Unauthorized",
      err.status || 401,
    );
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new HttpException(401, "Unauthorized: no user info");
    if (req.user.role !== "admin")
      throw new HttpException(403, "Forbidden: admins only");
    next();
  } catch (err: any) {
    ApiResponseHelper.error(res, err.message || "Forbidden", err.status || 403);
  }
};

// Alias for use in admin routes (identical behaviour, single source of truth)
export const adminOnlyMiddleware = adminMiddleware;

export const entrepreneurMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new HttpException(401, "Unauthorized: no user info");
    if (req.user.role !== "entrepreneur")
      throw new HttpException(403, "Forbidden: entrepreneurs only");
    next();
  } catch (err: any) {
    ApiResponseHelper.error(res, err.message || "Forbidden", err.status || 403);
  }
};

export const investorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new HttpException(401, "Unauthorized: no user info");
    if (req.user.role !== "investor")
      throw new HttpException(403, "Forbidden: investors only");
    next();
  } catch (err: any) {
    ApiResponseHelper.error(res, err.message || "Forbidden", err.status || 403);
  }
};
