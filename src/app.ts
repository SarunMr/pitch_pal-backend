import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { HttpException } from "./exceptions/http-exception";
import authRouter from "./routes/auth.route";
import path from "path";

const app: Application = express();

//Security Middleware
app.use(helmet());
const corsOptions = {
  origin: ["*"],
  successStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
//routes auth
app.use("/api/auth", authRouter);

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
