import { UserModel, IUser } from "../models/auth.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  findPaginated(
    page: number,
    limit: number,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<{ users: IUser[]; total: number }>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async getAll(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<{ users: IUser[]; total: number }> {
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find(filter).select("-password").skip(skip).limit(limit),
      UserModel.countDocuments(filter),
    ]);
    return { users, total };
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    return await UserModel.create(user);
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
