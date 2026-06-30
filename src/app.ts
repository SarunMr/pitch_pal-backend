import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { HttpException } from "./exceptions/http-exception";
import authRouter from "./routes/auth.route";
import adminUserRouter from "./routes/admin-user.route";
import path from "path";

const app: Application = express();

//Security Middleware
// Configure helmet to allow cross-origin images (needed for frontend at localhost:3000)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  successStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads — use process.cwd() so path is always relative to project root
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
//routes auth
app.use("/api/auth", authRouter);
//routes admin
app.use("/api/admin/users", adminUserRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});
export default app;
