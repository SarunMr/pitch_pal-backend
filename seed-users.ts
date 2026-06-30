import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { UserModel } from "./src/models/auth.model";
import { MONGODB_URL } from "./src/config/constant";

async function seed() {
  if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined in your environment variables!");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URL);
  console.log("Connected successfully.");

  const roles = ["entrepreneur", "investor", "admin"] as const;
  const statuses = ["active", "suspended", "banned"] as const;

  const usersToCreate = [];

  // Let's create 1 admin user first if it doesn't exist
  const adminPassword = await bcryptjs.hash("Admin123", 10);
  usersToCreate.push({
    username: "admin_user",
    email: "admin@pitchpal.com",
    password: adminPassword,
    role: "admin",
    status: "active",
    firstName: "System",
    lastName: "Admin",
    bio: "Super admin of the PitchPal system.",
    phone: "+9779800000000",
  });

  // Generate 10 test users
  for (let i = 1; i <= 10; i++) {
    const hashedPassword = await bcryptjs.hash(`Password${i}`, 10);
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];

    usersToCreate.push({
      username: `test_user_${i}`,
      email: `user${i}@pitchpal.com`,
      password: hashedPassword,
      role: role,
      status: status,
      firstName: `Test${i}`,
      lastName: `User${i}`,
      bio: `This is a generated test bio for test user ${i}.`,
      phone: `+97798123456${i.toString().padStart(2, "0")}`,
    });
  }

  console.log(`Inserting ${usersToCreate.length} users...`);
  
  for (const user of usersToCreate) {
    try {
      const existing = await UserModel.findOne({ email: user.email });
      if (existing) {
        console.log(`User with email ${user.email} already exists. Skipping.`);
        continue;
      }
      await UserModel.create(user);
      console.log(`Created user: ${user.username} (${user.email}) - Role: ${user.role}, Status: ${user.status}`);
    } catch (err: any) {
      console.error(`Failed to create user ${user.username}:`, err.message);
    }
  }

  console.log("Seeding finished!");
  await mongoose.connection.close();
}

seed().catch(console.error);
