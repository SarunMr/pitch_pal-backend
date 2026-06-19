import { UserMongoRepository } from "../repositories/auth.repository";
import { IUser } from "../models/auth.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginDTO, RegisterDTO, UpdateUserDTO } from "../dtos/auth.dto";
import { HttpException } from "../exceptions/http-exception";
import { SECRET_KEY } from "../config/constant";

const userRepository = new UserMongoRepository();

export class AuthService {
  async register(userData: RegisterDTO): Promise<IUser> {
    const existingEmail = await userRepository.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new HttpException(409, "Email already in use");
    }

    const existingUsername = await userRepository.getUserByUsername(
      userData.username,
    );
    if (existingUsername) {
      throw new HttpException(409, "Username already taken");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginData: LoginDTO): Promise<{ user: IUser; token: string }> {
    const user = await userRepository.getUserByEmail(loginData.email);
    if (!user) {
      throw new HttpException(401, "Invalid credentials");
    }

    const isPasswordValid = await bcryptjs.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY as string,
      { expiresIn: "7d" },
    );

    return { user, token };
  }
  async updateUser(id: string, userData: UpdateUserDTO): Promise<IUser> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (userData.username) {
      const existingUsername = await userRepository.getUserByUsername(
        userData.username,
      );
      if (existingUsername && existingUsername._id.toString() !== id) {
        throw new HttpException(409, "Username already taken");
      }
    }

    const updated = await userRepository.update(id, userData);
    if (!updated) {
      throw new HttpException(400, "Failed to update user");
    }

    return updated;
  }
}
