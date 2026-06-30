import mongoose, { Schema, Document } from "mongoose";
import { RegisterInput } from "../types/auth.type";

export interface IUser extends Omit<RegisterInput, "password">, Document {
  _id: mongoose.Types.ObjectId;
  password: string;
  status: "active" | "suspended" | "banned";
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserMongoSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["entrepreneur", "investor", "admin"],
      default: "investor",
    },

    // Profile — optional, filled later
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    phone: { type: String },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    // googleId:    { type: String },
    // authProvider:{ type: String, enum: ["local", "google"], default: "local" },
    // isVerified:  { type: Boolean, default: false },
    // kycStatus:   { type: String, enum: ["pending", "approved", "rejected"] },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);
