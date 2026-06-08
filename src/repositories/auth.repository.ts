import { UserModel, IUser } from "../models/auth.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
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
