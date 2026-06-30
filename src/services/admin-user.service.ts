import { UserMongoRepository } from "../repositories/auth.repository";
import { IUser } from "../models/auth.model";
import bcryptjs from "bcryptjs";
import { HttpException } from "../exceptions/http-exception";
import { CreateAdminUserDTO, UpdateAdminUserDTO } from "../dtos/admin-user.dto";
import { PaginationMeta } from "../types/admin-user.type";

const userRepository = new UserMongoRepository();

export class AdminUserService {
  async getUsers(
    page: number,
    limit: number,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<{ users: IUser[]; meta: PaginationMeta }> {
    const { users, total } = await userRepository.findPaginated(
      page,
      limit,
      search,
      role,
      status,
    );
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = { page, limit, total, totalPages };
    return { users, meta };
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.getUserById(id);
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }

  async createUser(data: CreateAdminUserDTO): Promise<IUser> {
    const existing = await userRepository.getUserByEmail(data.email);
    if (existing) throw new HttpException(409, "Email already in use");

    const existingUsername = await userRepository.getUserByUsername(data.username);
    if (existingUsername) throw new HttpException(409, "Username already taken");

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  async updateUser(id: string, data: UpdateAdminUserDTO): Promise<IUser> {
    const user = await userRepository.getUserById(id);
    if (!user) throw new HttpException(404, "User not found");

    if (data.username) {
      const existing = await userRepository.getUserByUsername(data.username);
      if (existing && existing._id.toString() !== id) {
        throw new HttpException(409, "Username already taken");
      }
    }

    const updated = await userRepository.update(id, data);
    if (!updated) throw new HttpException(400, "Failed to update user");
    return updated;
  }

  async deleteUser(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new HttpException(400, "Cannot delete your own account");
    }
    const user = await userRepository.getUserById(id);
    if (!user) throw new HttpException(404, "User not found");
    await userRepository.delete(id);
  }
}
