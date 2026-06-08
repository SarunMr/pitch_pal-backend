import app from "./src/app.ts";
import { PORT } from "./src/config/constant.ts";
import connectDB from "./src/database/mongodb";

import dotenv from "dotenv";
dotenv.config();

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();
